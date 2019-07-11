// "FILENAME":LINE.COLUMN: error: MESSAGE
// "FILENAME":START_LINE.COLUMN-END_LINE.COLUMN: error: MESSAGE
module.exports = function(data) {
    var output = [];

    Object.keys(data).sort().forEach(function(filename) {
        var errors = data[filename];

        output.push(errors.map(function(entry) {
            var error = entry.error || entry;
            var line = entry.line || -1;
            var column = entry.column || -1;
            var position = line + '.' + column;
            var message = entry.message || entry.error.rawMessage;
            var value = error.css ? ': `' + error.css + '`' : '';
            var allowed = error.syntax ? '; allowed: ' + error.syntax : '';

            if (error.loc) {
                position = error.loc.start.line + '.' +
                    error.loc.start.column + '-' +
                    error.loc.end.line + '.' +
                    error.loc.end.column;
            }

            return '"' +
                filename + '":' +
                position + ': ' +
                'error: ' +
                message +
                value +
                allowed;
        }).join('\n'));
    });

    return output.join('\n');
};
