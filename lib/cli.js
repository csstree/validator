import cli from 'clap';
import * as reporters from './reporter/index.js';
import { validatePath, validateString } from './helpers.js';
import { version } from './version.js';

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
    .version(version)
    .option('-r, --reporter <name>', 'Format of output: console (default), checkstyle, json, gnu', (name) => {
        if (!hasOwnProperty(name)) {
            throw new Error('Wrong value for reporter: ' + name);
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

export const run = command.run.bind(command);
export function isCliError(err) {
    return err instanceof cli.Error;
}
