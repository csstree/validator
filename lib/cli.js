const cli = require('clap');
const reporters = require('./reporter');
const { validatePath, validateString } = require('./validators');

function printResult(result, reporter) {
    const output = reporter(result);

    if (Object.keys(result).length > 0) {
        console.error(output);
        process.exit(1);
    }

    if (output) {
        console.log(output);
    }
}

const command = cli.create('csstree-validate', '[fileOrDir]')
    .version(require('../package.json').version)
    .option('-r, --reporter <name>', 'Format of output: console (default), checkstyle, json, gnu', function(name) {
        if (!reporters.hasOwnProperty(name)) {
            throw new cli.Error('Wrong value for reporter: ' + name);
        }
        return name;
    })
    .action(function(args) {
        const options = this.values;
        const inputPath = args[0];
        const reporter = reporters[options.reporter] || reporters.console;

        if (process.stdin.isTTY && !inputPath) {
            this.showHelp();
            return;
        }

        if (!inputPath) {
            const buffer = [];
            process.stdin
                .on('data', chunk => buffer.push(chunk))
                .on('end', () => printResult(validateString(buffer.join(''), '<stdin>'), reporter));
        } else {
            printResult(validatePath(args[0]), reporter);
        }
    });

module.exports = {
    run: command.run.bind(command),
    isCliError(err) {
        return err instanceof cli.Error;
    }
};
