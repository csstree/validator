// "FILENAME":LINE.COLUMN: error: MESSAGE
// "FILENAME":START_LINE.COLUMN-END_LINE.COLUMN: error: MESSAGE
export default function(result) {
    const output = [];

    for (const [filename, errors] of result) {
        output.push(errors.map((error) => {
            const line = error.line || -1;
            const column = error.column || -1;
            const message = error.message;
            const value = error.css ? ': `' + error.css + '`' : '';
            const allowed = error.syntax ? '; allowed: ' + error.syntax : '';
            let position = line + '.' + column;

            if (error.loc) {
                position += '-' +
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
    }

    return output.join('\n');
}
