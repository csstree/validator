import { lexer, parse, walk, property as propertyName } from 'css-tree';

const syntax = lexer;

function isTargetError(error) {
    if (!error) {
        return null;
    }

    if (error.name !== 'SyntaxError' &&
        error.name !== 'SyntaxMatchError' &&
        error.name !== 'SyntaxReferenceError') {
        return null;
    }

    return error;
}

function locFromIdentStart(ident, loc) {
    if (!loc) {
        return null;
    }

    const { source, start } = loc;

    return {
        source,
        start,
        end: {
            offset: start.offset + ident.length,
            line: start.line,
            column: start.column + ident.length
        }
    };
}

function makeErrorEntry(error, override) {
    Object.assign(error, override);

    if (error.loc) {
        const { source, start, end } = error.loc;

        // recreate loc to ensure shape and avoid sharing
        error.loc = {
            source,
            start: {
                offset: start.offset,
                line: start.line,
                column: start.column
            },
            end: {
                offset: end.offset,
                line: end.line,
                column: end.column
            }
        };

        // map loc.start values on error
        Object.assign(error, error.loc.start);
    }

    return error;
}

export function validateAtrule(node) {
    const atrule = node.name;
    const errors = [];
    let error;

    if (error = isTargetError(syntax.checkAtruleName(atrule))) {
        errors.push(makeErrorEntry(error, {
            atrule,
            loc: locFromIdentStart('@' + atrule, node.loc)
        }));

        return errors;
    }

    errors.push(...validateAtrulePrelude(
        atrule,
        node.prelude,
        node.loc
    ));

    if (node.block && node.block.children) {
        node.block.children.forEach(child => {
            if (child.type === 'Declaration') {
                errors.push(...validateAtruleDescriptor(
                    atrule,
                    child.property,
                    child.value,
                    child.loc
                ));
            }
        });
    }

    return errors;
}

export function validateAtrulePrelude(atrule, prelude, atruleLoc) {
    const errors = [];
    let error;

    if (error = isTargetError(syntax.checkAtrulePrelude(atrule, prelude))) {
        errors.push(makeErrorEntry(error, {
            atrule,
            loc: prelude ? prelude.loc : locFromIdentStart('@' + atrule, atruleLoc)
        }));
    } else if (error = isTargetError(syntax.matchAtrulePrelude(atrule, prelude).error)) {
        errors.push(makeErrorEntry(error, {
            atrule,
            ...error.rawMessage === 'Mismatch' &&
                { details: error.message, message: 'Invalid value for `@' + atrule + '` prelude' }
        }));
    }

    return errors;
}

export function validateAtruleDescriptor(atrule, descriptor, value, descriptorLoc) {
    const errors = [];
    let error;

    if (error = isTargetError(syntax.checkAtruleDescriptorName(atrule, descriptor))) {
        errors.push(makeErrorEntry(error, {
            atrule,
            descriptor,
            loc: locFromIdentStart(descriptor, descriptorLoc)
        }));
    } else {
        if (error = isTargetError(syntax.matchAtruleDescriptor(atrule, descriptor, value).error)) {
            errors.push(makeErrorEntry(error, {
                atrule,
                descriptor,
                ...error.rawMessage === 'Mismatch' &&
                    { details: error.message, message: 'Invalid value for `' + descriptor + '` descriptor' }
            }));
        }
    }

    return errors;
}

export function validateDeclaration(property, value, declarationLoc) {
    const errors = [];
    let error;

    if (propertyName(property).custom) {
        return errors;
    }

    if (error = isTargetError(syntax.checkPropertyName(property))) {
        errors.push(makeErrorEntry(error, {
            property,
            loc: locFromIdentStart(property, declarationLoc)
        }));
    } else if (error = isTargetError(syntax.matchProperty(property, value).error)) {
        errors.push(makeErrorEntry(error, {
            property,
            ...error.rawMessage === 'Mismatch' &&
                { details: error.message, message: 'Invalid value for `' + property + '` property' }
        }));
    }

    return errors;
}

export function validateRule(node) {
    const errors = [];

    if (node.block && node.block.children) {
        node.block.children.forEach(child => {
            if (child.type === 'Declaration') {
                errors.push(...validateDeclaration(
                    child.property,
                    child.value,
                    child.loc
                ));
            }
        });
    }

    return errors;
}

export function validate(css, filename) {
    const errors = [];
    const ast = typeof css !== 'string'
        ? css
        : parse(css, {
            filename,
            positions: true,
            parseAtrulePrelude: false,
            parseRulePrelude: false,
            parseValue: false,
            parseCustomProperty: false,
            onParseError(error) {
                errors.push(error);
            }
        });

    walk(ast, {
        visit: 'Atrule',
        enter(node) {
            errors.push(...validateAtrule(node));
        }
    });

    walk(ast, {
        visit: 'Rule',
        enter(node) {
            errors.push(...validateRule(node));
        }
    });

    return errors;
};
