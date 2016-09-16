// [{ "name": {file}, "line": {line},"column": {column},"message": {error} }] 
module.exports = function(data){
    var output = [];

    Object.keys(data).sort().forEach(function(name){
        var error = data[name];

        output = output.concat((Array.isArray(error) ? error : ['[ERROR] ' + error]).map(function(error){
            return {
                name: name,
                line: error.line || 1,
                column: error.column || 1,
                message: String(error.error),
            };
        }));
    });

    return JSON.stringify(output);
};
