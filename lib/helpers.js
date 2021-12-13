import { statSync, readdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { validate } from './validate.js';

function createResult() {
    const result = Object.create(null);

    result[Symbol.iterator] = function*() {
        for (const [filename, errors] of Object.entries(this)) {
            yield [filename, errors];
        }
    };

    return result;
}

function defaultShouldBeValidated(filename) {
    return extname(filename) === '.css';
}

function collectFiles(testPath, shouldBeValidated) {
    try {
        if (statSync(testPath).isDirectory()) {
            return [].concat(...readdirSync(testPath).map(dirFilename =>
                collectFiles(join(testPath, dirFilename), shouldBeValidated)
            )).sort();
        } else {
            return shouldBeValidated(testPath) ? [testPath] : [];
        }
    } catch (e) {
        return [testPath];
    }
}

export function validateDictionary(dictionary) {
    const result = createResult();

    for (const filename of Object.keys(dictionary).sort()) {
        result[filename] = validate(dictionary[filename], filename);
    }

    return result;
}

export function validateString(css, filename) {
    const result = createResult();

    if (!filename) {
        filename = '<unknown>';
    }

    result[filename] = validate(css, filename);

    return result;
}

export function validateFile(filename) {
    const result = createResult();
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
    const result = createResult();

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

    return validateFileList([...fileList].sort());
}

export function validatePath(searchPath, filter) {
    if (typeof filter !== 'function') {
        filter = defaultShouldBeValidated;
    }

    return validateFileList(collectFiles(searchPath, filter));
}
