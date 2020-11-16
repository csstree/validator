const csstree = require('css-tree');
const syntax = csstree.lexer;

module.exports = function validate(css, filename) {
    const errors = [];
    const ast = csstree.parse(css, {
        filename,
        positions: true,
        onParseError(error) {
            errors.push(error);
        }
    });

    csstree.walk(ast, {
        visit: 'Declaration',
        enter(node) {
            const { error } = syntax.matchDeclaration(node);

            if (error) {
                let message = error.rawMessage || error.message || error;

                // ignore errors except those which make sense
                if (error.name !== 'SyntaxMatchError' &&
                    error.name !== 'SyntaxReferenceError') {
                    return;
                }

                if (message === 'Mismatch') {
                    message = 'Invalid value for `' + node.property + '`';
                }

                errors.push({
                    name: error.name,
                    node,
                    loc: error.loc || node.loc,
                    line: error.line || node.loc && node.loc.start && node.loc.start.line,
                    column: error.column || node.loc && node.loc.start && node.loc.start.column,
                    property: node.property,
                    message,
                    error
                });
            }
        }
    });

    return errors;
};
