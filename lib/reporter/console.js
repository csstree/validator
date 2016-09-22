module.exports = function(data){
    var output = [];

    Object.keys(data).sort().forEach(function(filename){
        var error = data[filename];
        output.push('    ' + filename);
        if (error) {
            if (Array.isArray(error)) {
                output.push.apply(output, error.map(function(item){
                    return '        * ' +
                        String(item.error.message || item.error)
                            .replace(/^[^\n]+/, item.message)
                            .replace(/\n/g, '\n            ');
                }));
            } else {
                output.push('       [ERROR] ' + error);
            }
        }
        output.push('');
    });

    return output.join('\n');
};
