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

function validate(css) {
    var errors = [];

    try {
        csstree.walkDeclarations(csstree.parse(css, { positions: true }), function(node) {
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
                    line: error.line || node.info.line,
                    column: error.column || node.info.column,
                    property: node.property,
                    message: message,
                    error: syntax.lastMatchError
                });
            }
        });
    } catch(e) {
        return e;
    }

    return errors;
}

function validateString(css, filename) {
    var result = {};

    result[filename || '<unknown>'] = validate(css);

    return result;
}

function validateFile(filename) {
    var css = fs.readFileSync(filename, 'utf-8');
    var result = {};

    result[filename] = validate(css);

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
        var res = validateFile(filename);

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
