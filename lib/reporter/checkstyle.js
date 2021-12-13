// <?xml version="1.0" encoding="utf-8"?>
// <checkstyle version="4.3">
//     <file name="{filename}">
//         <error line="{line}" column="{column}" severity="error" message="{message}" source="csstree-validator" />
//     </file>
// </checkstyle>
export default function(result) {
    const output = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<checkstyle version="4.3">'
    ];

    for (const [filename, errors] of result) {
        output.push(
            '\t<file name="' + filename + '">',
            errors.map(entry =>
                '\t\t<error ' +
                'line="' + (entry.line || 1) + '" ' +
                'column="' + (entry.column || 1) + '" ' +
                'severity="error" ' +
                'message="' + String(entry.message || entry.error).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" source="csstree-validator"/>'
            ).join('\n'),
            '\t</file>'
        );
    }

    output.push('</checkstyle>');

    return output.join('\n');
}
