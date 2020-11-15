// "FILENAME":LINE.COLUMN: error: MESSAGE
// "FILENAME":START_LINE.COLUMN-END_LINE.COLUMN: error: MESSAGE
module.exports = function(data) {
    const output = [];

    Object.keys(data).sort().forEach(function(filename) {
        const errors = data[filename];

        output.push(errors.map(function(entry) {
            const error = entry.error || entry;
            const line = entry.line || -1;
            const column = entry.column || -1;
            const message = entry.message || entry.error.rawMessage;
            const value = error.css ? ': `' + error.css + '`' : '';
            const allowed = error.syntax ? '; allowed: ' + error.syntax : '';
            let position = line + '.' + column;

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
