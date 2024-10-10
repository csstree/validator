// [{ "name": {file}, "line": {line}, "column": {column}, "property": {property}, "message": {error}, "details": {details} }]
export default function(result) {
    const output = [];

    for (const [filename, errors] of result) {
        output.push(...errors.map((entry) => {
            const error = entry.error || entry;

            return {
                name: filename,
                line: entry.line || 1,
                column: entry.column || 1,
                atrule: entry.atrule,
                descriptor: entry.descriptor,
                property: entry.property,
                message: entry.message,
                details: error.details || (error.rawMessage ? error.message : null)
            };
        }));
    }

    return JSON.stringify(output, null, 4);
}
