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
        return [filename];
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

function validateFile(filename) {
    var css = fs.readFileSync(filename, 'utf-8');
    var errors = [];

    try {
        csstree.walkDeclarations(csstree.parse(css, { positions: true }), function(node) {
            if (!syntax.match(node.property.name, node.value)) {
                var error = syntax.lastMatchError;
                var message = error.rawMessage || error.message || error;

                if (message === 'Mismatch') {
                    message = 'Bad value for `' + node.property.name + '`';
                } else if (message === 'Uncomplete match') {
                    message = 'The rest part of value can\'t to be matched on `' + node.property.name + '` syntax';
                }

                errors.push({
                    node: node,
                    line: node.info.line,
                    column: node.info.column,
                    property: node.property.name,
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

module.exports = function(paths) {
    return extractFilenames(paths).reduce(function(result, filename) {
        var res = validateFile(filename);

        if (res && res.length) {
            result[filename] = res;
        }

        return result;
    }, {});
};
