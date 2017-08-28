var fs = require('fs');
var path = require('path');
var csstree = require('css-tree');
var syntax = csstree.lexer;

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
            var match = syntax.matchDeclaration(node);
            var error = match.error;

            if (error) {
                var message = error.rawMessage || error.message || error;

                // ignore errors except those which make sense
                if (error.name !== 'SyntaxMatchError' &&
                    error.name !== 'SyntaxReferenceError') {
                    return;
                }

                if (message === 'Mismatch') {
                    message = 'Invalid value for `' + node.property + '`';
                } else if (message === 'Uncomplete match') {
                    message = 'The rest part of value can\'t to be matched on `' + node.property + '` syntax';
                } else if (error.name === 'SyntaxReferenceError') {
                    message += ': ' + node.property.toLowerCase();
                }

                errors.push({
                    node: node,
                    loc: error.loc || node.loc,
                    line: error.line || node.loc && node.loc.start && node.loc.start.line,
                    column: error.column || node.loc && node.loc.start && node.loc.start.column,
                    property: node.property,
                    message: message,
                    error: error
                });
            }
        });
    } catch (e) {
        errors.push(e);
    }

    return errors;
}

function validateDictionary(dictionary) {
    var result = {};

    for (var filename in dictionary) {
        if (Object.prototype.hasOwnProperty.call(dictionary, filename)) {
            result[filename] = validate(dictionary[filename], filename);
        }
    }

    return result;
}

function validateString(css, filename) {
    var result = {};

    if (!filename) {
        filename = '<unknown>';
    }

    result[filename] = validate(css, filename);

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
    validateDictionary: validateDictionary,
    validateString: validateString
};
