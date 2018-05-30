var fs = require('fs');
var path = require('path');
var csstree = require('css-tree');
var syntax = csstree.lexer;

function defaultShouldBeValidated(filename) {
    return path.extname(filename) === '.css';
}

function collectFiles(testPath, shouldBeValidated) {
    try {
        if (fs.statSync(testPath).isDirectory()) {
            return fs.readdirSync(testPath).reduce(function(result, dirFilename) {
                return result.concat(collectFiles(path.join(testPath, dirFilename), shouldBeValidated));
            }, []);
        } else {
            return shouldBeValidated(testPath) ? [testPath] : [];
        }
    } catch (e) {
        return [testPath];
    }
}

function validate(css, filename) {
    var errors = [];
    var ast = csstree.parse(css, {
        filename: filename,
        positions: true,
        onParseError: function(error) {
            errors.push(error);
        }
    });

    csstree.walk(ast, {
        visit: 'Declaration',
        enter: function(node) {
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
                }

                errors.push({
                    name: error.name,
                    node: node,
                    loc: error.loc || node.loc,
                    line: error.line || node.loc && node.loc.start && node.loc.start.line,
                    column: error.column || node.loc && node.loc.start && node.loc.start.column,
                    property: node.property,
                    message: message,
                    error: error
                });
            }
        }
    });

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
    var result = {};
    var css;

    try {
        css = fs.readFileSync(filename, 'utf-8');
        result[filename] = validate(css, filename);
    } catch (e) {
        result[filename] = [e];
    }

    return result;
}

function validateFileList(list) {
    return list.reduce(function(result, filename) {
        var res = validateFile(filename)[filename];

        if (res && res.length !== 0) {
            result[filename] = res;
        }

        return result;
    }, {});
}

function validatePath(searchPath, shouldBeValidated) {
    if (typeof shouldBeValidated !== 'function') {
        shouldBeValidated = defaultShouldBeValidated;
    }

    return validateFileList(collectFiles(searchPath, shouldBeValidated));
}

function validatePathList(pathList, shouldBeValidated) {
    if (typeof shouldBeValidated !== 'function') {
        shouldBeValidated = defaultShouldBeValidated;
    }

    var fileList = Object.keys(
        pathList.reduce(function(result, searchPath) {
            collectFiles(searchPath, shouldBeValidated).forEach(function(filename) {
                result[filename] = true;
            });
            return result;
        }, {})
    );

    return validateFileList(fileList);
};

module.exports = {
    validatePathList: validatePathList,
    validatePath: validatePath,
    validateFile: validateFile,
    validateDictionary: validateDictionary,
    validateString: validateString
};
