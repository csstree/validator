import { statSync, readdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { validate } from './validate.js';

const { hasOwnProperty } = Object.prototype;

function defaultShouldBeValidated(filename) {
    return extname(filename) === '.css';
}

function collectFiles(testPath, shouldBeValidated) {
    try {
        if (statSync(testPath).isDirectory()) {
            return readdirSync(testPath).reduce(
                (result, dirFilename) =>
                    result.concat(collectFiles(join(testPath, dirFilename), shouldBeValidated)),
                []
            );
        } else {
            return shouldBeValidated(testPath) ? [testPath] : [];
        }
    } catch (e) {
        return [testPath];
    }
}

export function validateDictionary(dictionary) {
    const result = Object.create(null);

    for (const filename in dictionary) {
        if (hasOwnProperty.call(dictionary, filename)) {
            result[filename] = validate(dictionary[filename], filename);
        }
    }

    return result;
}

export function validateString(css, filename) {
    const result = Object.create(null);

    if (!filename) {
        filename = '<unknown>';
    }

    result[filename] = validate(css, filename);

    return result;
}

export function validateFile(filename) {
    const result = Object.create(null);
    let css;

    try {
        css = readFileSync(filename, 'utf-8');
        result[filename] = validate(css, filename);
    } catch (e) {
        result[filename] = [e];
    }

    return result;
}

function validateFileList(list) {
    const result = Object.create(null);

    for (const filename of list) {
        const res = validateFile(filename)[filename];

        if (res && res.length !== 0) {
            result[filename] = res;
        }
    }

    return result;
}

export function validatePathList(pathList, filter) {
    if (typeof filter !== 'function') {
        filter = defaultShouldBeValidated;
    }

    const fileList = new Set([].concat(...pathList.map(path =>
        collectFiles(path, filter)
    )));

    return validateFileList([...fileList]);
}

export function validatePath(searchPath, filter) {
    if (typeof filter !== 'function') {
        filter = defaultShouldBeValidated;
    }

    return validateFileList(collectFiles(searchPath, filter));
}
