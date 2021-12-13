export default function(result) {
    const output = [];

    for (const [filename, errors] of result) {
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
