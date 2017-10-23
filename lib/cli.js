var cli = require('clap');
var reporters = require('./reporter');
var validatePath = require('./validate.js').validatePath;
var validateString = require('./validate.js').validateString;

var command = cli.create('csstree-validate', '[fileOrDir]')
    .version(require('../package.json').version)
    .option('-r, --reporter <name>', 'Format of output: console (default), checkstyle, json, gnu', function(name) {
        if (!reporters.hasOwnProperty(name)) {
            throw new cli.Error('Wrong value for reporter: ' + name);
        }
        return name;
    })
    .action(function(args) {
        var options = this.values;
        var inputPath = args[0];
        var reporter = reporters[options.reporter] || reporters.console;

        if (process.stdin.isTTY && !inputPath) {
            this.showHelp();
            return;
        }

        if (!inputPath) {
            var buffer = [];
            process.stdin
                .on('data', function(chunk) {
                    buffer.push(chunk);
                })
                .on('end', function() {
                    console.log(reporter(validateString(buffer.join(''), '<stdin>')));
                });
        } else {
            console.log(reporter(validatePath(args[0])));
        }
    });

module.exports = {
    run: command.run.bind(command),
    isCliError: function(err) {
        return err instanceof cli.Error;
    }
};
