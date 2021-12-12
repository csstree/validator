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

export function validateAtrule(node) {
    const atrule = node.name;
    const errors = [];
    let error;

    if (error = isTargetError(syntax.checkAtruleName(atrule))) {
        errors.push(Object.assign(error, {
            atrule,
            ...node.loc && node.loc.start
        }));

        return errors;
    }

    errors.push(...validateAtrulePrelude(
        atrule,
        node.prelude,
        (node.prelude && node.prelude.loc && node.prelude.loc.start) || (node.loc && node.loc.start)
    ));

    if (node.block && node.block.children) {
        node.block.children.forEach(child => {
            if (child.type === 'Declaration') {
                errors.push(...validateAtruleDescriptor(
                    atrule,
                    child.property,
                    child.value,
                    child.loc && child.loc.start
                ));
            }
        });
    }

    return errors;
}

export function validateAtrulePrelude(atrule, prelude, preludeLoc) {
    const errors = [];
    let error;

    if (error = isTargetError(syntax.checkAtrulePrelude(atrule, prelude))) {
        errors.push(Object.assign(error, {
            atrule,
            ...preludeLoc
        }));
    } else if (error = isTargetError(syntax.matchAtrulePrelude(atrule, prelude).error)) {
        errors.push(Object.assign(error, {
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
        errors.push(Object.assign(error, {
            atrule,
            descriptor,
            ...descriptorLoc
        }));
    } else {
        if (error = isTargetError(syntax.matchAtruleDescriptor(atrule, descriptor, value).error)) {
            errors.push(Object.assign(error, {
                atrule,
                descriptor,
                ...error.rawMessage === 'Mismatch' &&
                    { details: error.message, message: 'Invalid value for `' + descriptor + '` descriptor' }
            }));
        }
    }

    return errors;
}

export function validateDeclaration(property, value, valueLoc) {
    const errors = [];
    let error;

    if (propertyName(property).custom) {
        return errors;
    }

    if (error = isTargetError(syntax.checkPropertyName(property))) {
        errors.push(Object.assign(error, {
            property,
            ...valueLoc
        }));
    } else if (error = isTargetError(syntax.matchProperty(property, value).error)) {
        errors.push(Object.assign(error, {
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
                    child.loc && child.loc.start
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
