// <?xml version="1.0" encoding="utf-8"?>
// <checkstyle version="4.3">
//         <file name="{filename}">
//                 <error line="{line}" column="{column}" severity="error" message="{message}" source="basisjs" />
//         </file>
// </checkstyle>
module.exports = function(data){
    var output = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<checkstyle version="4.3">'
    ];

    Object.keys(data).sort().forEach(function(name){
        var error = data[name];
        output.push(
            '\t<file name="' + name + '">',
            (Array.isArray(error) ? error : ['[ERROR] ' + error]).map(function(error){
                return '\t\t<error ' +
                    'line="' + (error.line || 1) + '" ' +
                    'column="' + (error.column || 1) + '" ' +
                    'severity="error" ' + 
                    'message="' + String(error.error).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" source="basisjs-lint"/>';
            }).join('\n'),
            '\t</file>'
        );
    });

    output.push('</checkstyle>');

    return output.join('\n');
};
