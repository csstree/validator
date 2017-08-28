module.exports = function(data) {
    var output = [];

    Object.keys(data).sort().forEach(function(filename) {
        var errors = data[filename];

        output.push('# ' + filename);
        output.push.apply(output, errors.map(function(entry) {
            if (entry.name === 'CssSyntaxError') {
                return '    [ERROR] ' + entry;
            }

            return '    * ' +
                String(entry.error.message || entry.error)
                    .replace(/^[^\n]+/, entry.message)
                    .replace(/\n/g, '\n    ');
        }));
        output.push('');
    });

    return output.join('\n');
};
