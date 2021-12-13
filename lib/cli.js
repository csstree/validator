import path from 'path';
import fs from 'fs';
import resolve from 'resolve';
import { command as createCommand, Error as CliError } from 'clap';
import * as reporters from './reporter/index.js';
import { validatePath, validateString } from './helpers.js';
import { version } from './version.js';

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
    .option(
        '-r, --reporter <nameOrFile>',
        'Output formatter: console (default), checkstyle, json, gnu or <path to a module>',
        (nameOrFile) => {
            const modulePath = path.resolve(process.cwd(), nameOrFile);

            if (fs.existsSync(modulePath)) {
                return import(modulePath);
            }

            if (!hasOwnProperty.call(reporters, nameOrFile)) {
                try {
                    const resolvedPath = resolve.sync(nameOrFile, { basedir: process.cwd() });
                    return import(resolvedPath);
                } catch (e) {}

                throw new CliError('Wrong value for reporter: ' + nameOrFile);
            }

            return nameOrFile;
        },
        'console'
    )
    .action(async ({ options, args }) => {
        const inputPath = args[0];
        const reporter = typeof options.reporter === 'string'
            ? reporters[options.reporter]
            : (await options.reporter).default;

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
                throw new CliError(`ERROR! No such file or directory: ${inputPath}`);
            }

            printResult(validatePath(args[0]), reporter);
        }
    });

export const run = command.run.bind(command);
export function isCliError(err) {
    return err instanceof CliError;
}
