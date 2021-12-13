import { command as createCommand, Error as CliError } from 'clap';
import fs from 'fs';
import * as reporters from './reporter/index.js';
import { validatePath, validateString } from './helpers.js';
import { version } from './version.js';

function errorAndExit(message) {
    console.error(message);
    process.exit(1);
}

async function readStdin() {
    const buffer = [];

    for await (const chunk of process.stdin) {
        buffer.push(chunk);
    }

    return buffer.join('');
}

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

const command = createCommand('csstree-validate [fileOrDir]')
    .version(version)
    .option('-r, --reporter <name>', 'Output format: console (default), checkstyle, json, gnu', (name) => {
        if (!hasOwnProperty.call(reporters, name)) {
            throw new Error('Wrong value for reporter: ' + name);
        }

        return name;
    })
    .action(async ({ options, args }) => {
        const inputPath = args[0];
        const reporter = reporters[options.reporter] || reporters.console;

        if (process.stdin.isTTY && !inputPath) {
            command.run(['--help']);
            return;
        }

        if (!inputPath) {
            readStdin().then(input =>
                printResult(validateString(input, '<stdin>'), reporter)
            );
        } else {
            if (!fs.existsSync(inputPath)) {
                throw new Error(`ERROR! No such file or directory: ${inputPath}`);
            }

            printResult(validatePath(args[0]), reporter);
        }
    });

export const run = command.run.bind(command);
export function isCliError(err) {
    return err instanceof CliError;
}
