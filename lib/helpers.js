const fs = require('fs');
const path = require('path');
const { validate } = require('./validate');

function defaultShouldBeValidated(filename) {
    return path.extname(filename) === '.css';
}

function collectFiles(testPath, shouldBeValidated) {
    try {
        if (fs.statSync(testPath).isDirectory()) {
            return fs.readdirSync(testPath).reduce(
                (result, dirFilename) =>
                    result.concat(collectFiles(path.join(testPath, dirFilename), shouldBeValidated)),
                []
            );
        } else {
            return shouldBeValidated(testPath) ? [testPath] : [];
        }
    } catch (e) {
        return [testPath];
    }
}

function validateDictionary(dictionary) {
    const result = {};

    for (const filename in dictionary) {
        if (Object.prototype.hasOwnProperty.call(dictionary, filename)) {
            result[filename] = validate(dictionary[filename], filename);
        }
    }

    return result;
}

function validateString(css, filename) {
    const result = {};

    if (!filename) {
        filename = '<unknown>';
    }

    result[filename] = validate(css, filename);

    return result;
}

function validateFile(filename) {
    const result = {};
    let css;

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
        const res = validateFile(filename)[filename];

        if (res && res.length !== 0) {
            result[filename] = res;
        }

        return result;
    }, {});
}

function validatePath(searchPath, filter) {
    if (typeof filter !== 'function') {
        filter = defaultShouldBeValidated;
    }

    return validateFileList(collectFiles(searchPath, filter));
}

function validatePathList(pathList, filter) {
    if (typeof filter !== 'function') {
        filter = defaultShouldBeValidated;
    }

    const fileList = Object.keys(
        pathList.reduce(function(result, searchPath) {
            collectFiles(searchPath, filter).forEach(function(filename) {
                result[filename] = true;
            });
            return result;
        }, {})
    );

    return validateFileList(fileList);
};

module.exports = {
    validatePathList,
    validatePath,
    validateFile,
    validateDictionary,
    validateString
};
