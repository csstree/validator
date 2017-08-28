// [{ "name": {file}, "line": {line},"column": {column},"message": {error} }]
module.exports = function(data) {
    var output = [];

    Object.keys(data).sort().forEach(function(name) {
        var errors = data[name];

        output = output.concat(errors.map(function(entry) {
            var error = entry.error || entry;

            return {
                name: name,
                line: entry.line || 1,
                column: entry.column || 1,
                property: entry.property,
                message: entry.message,
                details: error.rawMessage ? error.message : null
            };
        }));
    });

    return JSON.stringify(output, null, 4);
};
