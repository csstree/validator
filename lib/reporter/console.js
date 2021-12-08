export default function(data) {
    const output = [];

    for (const filename of Object.keys(data).sort()) {
        const errors = data[filename];

        output.push('# ' + filename);
        output.push(...errors.map(function(error) {
            if (error.name === 'SyntaxError') {
                return '    [ERROR] ' + error.message;
            }

            return '    * ' +
                String(error.details)
                    .replace(/^[^\n]+/, error.message)
                    .replace(/\n/g, '\n    ');
        }));
        output.push('');
    }

    return output.join('\n');
}
