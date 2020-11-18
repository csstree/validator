module.exports = function(data) {
    const output = [];

    Object.keys(data).sort().forEach(function(filename) {
        const errors = data[filename];

        output.push('# ' + filename);
        output.push.apply(output, errors.map(function(error) {
            if (error.name === 'SyntaxError') {
                return '    [ERROR] ' + error.message;
            }

            return '    * ' +
                String(error.details)
                    .replace(/^[^\n]+/, error.message)
                    .replace(/\n/g, '\n    ');
        }));
        output.push('');
    });

    return output.join('\n');
};
