import assert, { deepStrictEqual, strictEqual } from 'assert';
import path from 'path';
import { readFileSync } from 'fs';
import { spawn } from 'child_process';

const { version } = JSON.parse(readFileSync('./package.json'));
const cmd = path.resolve('./bin/validate.js');

function fixturePath(filepath) {
    return path.join(path.resolve('fixtures'), filepath);
}

function fixtureContent(filepath) {
    return readFileSync(fixturePath(filepath), 'utf-8').trim();
}

function assertOutput(actual, expected) {
    if (typeof expected === 'function') {
        expected(actual.trim());
    } else if (typeof expected === 'string') {
        strictEqual(actual.trim(), expected);
    } else if (expected instanceof RegExp) {
        assert.match(actual.trim(), expected);
    } else {
        deepStrictEqual(JSON.parse(actual), expected);
    }
}

function run(...cliArgs) {
    let stderr = '';
    let stdout = '';
    const options = typeof cliArgs[0] === 'object' ? cliArgs.shift() : null;
    const args = [cmd, ...cliArgs];
    const child = spawn('node', args, { stdio: 'pipe', ...options });
    const wrapper = new Promise((resolve, reject) => {
        child.once('close', (code) =>
            code > 1 ? reject(new Error(stderr)) : resolve({ stdout, stderr })
        );
    });

    child.stderr.on('data', chunk => stderr += chunk);
    child.stdout.on('data', chunk => stdout += chunk);

    wrapper.stdin = (data) => {
        child.stdin.write(data);
        child.stdin.end();
        return wrapper;
    };
    wrapper.stdout = expected =>
        Object.assign(wrapper.then(({ stdout: actual }) =>
            assertOutput(actual, expected)
        ), { stderr: wrapper.stderr });
    wrapper.stderr = expected =>
        Object.assign(wrapper.then(({ stderr: actual }) =>
            assertOutput(actual, expected)
        ), { stdout: wrapper.stdout });

    return wrapper;
}

it('should output version', () =>
    run('-v')
        .stdout(version)
);

it('should output help', () =>
    run('-h')
        .stdout(/Usage:/)
);

it('should read content from stdin if no file specified', () =>
    run()
        .stdin(fixtureContent('css/style.css'))
        .stderr(fixtureContent('css/style.validate-result')
            .replace(/^#.+\n/, '# <stdin>\n')
        )
);

it('should read from file', () =>
    run(path.relative(process.cwd(), fixturePath('css/style.css')))
        .stderr(fixtureContent('css/style.validate-result'))
);

it('should error when wrong reporter', () =>
    run(path.relative(process.cwd(), fixturePath('css/style.css')), '--reporter', 'bad-value')
        .stderr('Wrong value for reporter: bad-value')
);

it('should error when file doesn\'t exist', () =>
    run('not/exists.css')
        .stderr('ERROR! No such file or directory: not/exists.css')
);

describe('custom reporter', () => {
    const cwd = path.resolve('fixtures/custom-reporter');
    const tests = {
        // module
        'ESM module': 'custom-reporter.js',
        'commonjs module': 'custom-reporter.cjs',
    
        // package
        'commonjs package': 'commonjs',
        'commonjs package (path to dir)': 'commonjs/lib',
        'commonjs package (full path)': 'commonjs/lib/index.js',
        'esm package': 'esm',
        'esm package (full path)': 'esm/lib/index.js',
        'dual package': 'dual',
        'dual package (full path)': 'dual/lib/index.js',
        'dual package (full path to cjs)': 'dual/lib/index.cjs'
    }

    for (const [title, reporter] of Object.entries(tests)) {
        it(title, () =>
            run({ cwd }, 'style.css', '-r', reporter)
                .stderr('OK')
        );
    }
});
