// [{ "name": {file}, "line": {line},"column": {column},"message": {error} }]
module.exports = function(data) {
    const output = Object.keys(data).sort().reduce(function(res, name) {
        const errors = data[name];

        return res.concat(errors.map(function(entry) {
            const error = entry.error || entry;

            return {
                name: name,
                line: entry.line || 1,
                column: entry.column || 1,
                property: entry.property,
                message: entry.message,
                details: error.details || (error.rawMessage ? error.message : null)
            };
        }));
    }, []);

    return JSON.stringify(output, null, 4);
};
