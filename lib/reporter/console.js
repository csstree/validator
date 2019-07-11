module.exports = function(data) {
    var output = [];

    Object.keys(data).sort().forEach(function(filename) {
        var errors = data[filename];

        output.push('# ' + filename);
        output.push.apply(output, errors.map(function(entry) {
            var error = entry.error || entry;

            if (error.name === 'SyntaxError') {
                return '    [ERROR] ' + error.message;
            }

            return '    * ' +
                String(error.message)
                    .replace(/^[^\n]+/, entry.message)
                    .replace(/\n/g, '\n    ');
        }));
        output.push('');
    });

    return output.join('\n');
};
