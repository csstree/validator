// [{ "name": {file}, "line": {line},"column": {column},"message": {error} }]
export default function(data) {
    const output = [];

    for (const name of Object.keys(data).sort()) {
        const errors = data[name];

        output.push(...errors.map((entry) => {
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
    }

    return JSON.stringify(output, null, 4);
}
