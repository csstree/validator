var cli = require('clap');
var validate = require('./validate.js')
var reporters = {
    json: require('./reporter/json.js'),
    console: require('./reporter/console.js'),
    checkstyle: require('./reporter/checkstyle.js')
};

var command = cli.create('csstree-validate', '[fileOrDir]')
    .version(require('../package.json').version)
    .option('-r, --reporter <name>', 'Format of output: console (default), checkstyle, json', function(name) {
        if (!reporters.hasOwnProperty(name)) {
            throw new Error('Wrong value for reporter: ' + name);
        }
        return name;
    })
    .action(function(args) {
        var options = this.values;
        var reporter = reporters[options.reporter] || reporters.console;

        if (process.stdin.isTTY && !args.length) {
            this.showHelp();
            return;
        }

        console.log(reporter(validate.byPaths(args)));
    });

module.exports = {
    run: command.run.bind(command),
    isCliError: function(err) {
        return err instanceof cli.Error;
    }
};
