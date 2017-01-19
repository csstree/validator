var fs = require('fs');
var path = require('path');
var csstree = require('css-tree');
var syntax = csstree.syntax.defaultSyntax;

function collectFiles(filename) {
    if (fs.statSync(filename).isDirectory()) {
        return fs.readdirSync(filename).reduce(function(result, dirFilename) {
            return result.concat(collectFiles(path.join(filename, dirFilename)));
        }, []);
    } else {
        return path.extname(filename) === '.css' ? [filename] : [];
    }
}

function extractFilenames(paths) {
    return Object.keys(paths.map(collectFiles).reduce(function(result, filenames) {
        filenames.forEach(function(filename) {
            result[filename] = true;
        });
        return result;
    }, {}));
}

function validate(css, filename) {
    var errors = [];
    var parseOptions = {
        filename: filename,
        positions: true
    };

    try {
        csstree.walkDeclarations(csstree.parse(css, parseOptions), function(node) {
            if (!syntax.matchProperty(node.property, node.value)) {
                var error = syntax.lastMatchError;
                var message = error.rawMessage || error.message || error;

                if (message === 'Mismatch') {
                    message = 'Invalid value for `' + node.property + '`';
                } else if (message === 'Uncomplete match') {
                    message = 'The rest part of value can\'t to be matched on `' + node.property + '` syntax';
                }

                errors.push({
                    node: node,
                    loc: error.loc || node.loc,
                    line: error.line || node.loc && node.loc.start && node.loc.start.line,
                    column: error.column || node.loc && node.loc.start && node.loc.start.column,
                    property: node.property,
                    message: message,
                    error: syntax.lastMatchError
                });
            }
        });
    } catch (e) {
        return e;
    }

    return errors;
}

function validateString(css, filename) {
    var result = {};

    result[filename || '<unknown>'] = validate(css, filename || '<unknown>');

    return result;
}

function validateFile(filename) {
    var css = fs.readFileSync(filename, 'utf-8');
    var result = {};

    result[filename] = validate(css, filename);

    return result;
}

function validatePath(path) {
    return collectFiles(path).reduce(function(result, filename) {
        var res = validateFile(filename)[filename];

        if (res && res.length !== 0) {
            result[filename] = res;
        }

        return result;
    }, {});
}

function validatePathList(paths) {
    return extractFilenames(paths).reduce(function(result, filename) {
        var res = validatePath(filename);

        if (res && res.length !== 0) {
            result[filename] = res;
        }

        return result;
    }, {});
};

module.exports = {
    validatePathList: validatePathList,
    validatePath: validatePath,
    validateFile: validateFile,
    validateString: validateString
};
