// [{ "name": {file}, "line": {line},"column": {column},"message": {error} }] 
module.exports = function(data){
    var output = [];

    Object.keys(data).sort().forEach(function(name){
        var error = data[name];

        output = output.concat((Array.isArray(error) ? error : ['[ERROR] ' + error]).map(function(entry){
            return {
                name: name,
                line: entry.line || 1,
                column: entry.column || 1,
                property: entry.property,
                message: String(entry.error.rawMessage || entry.error),
                details: entry.error.rawMessage ? entry.error.message : null
            };
        }));
    });

    return JSON.stringify(output);
};
