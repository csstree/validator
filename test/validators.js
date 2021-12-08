import path from 'path';
import { strictEqual, deepStrictEqual } from 'assert';
import {
    validateString,
    validateDictionary,
    validateFile,
    validatePath,
    validatePathList
} from 'csstree-validator';

const fixturePath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    'fixture/css'
);

describe('validators', () => {
    describe('validateString', () => {
        it('should validate errors in CSS string', () => {
            const errors = validateString('foo { a: 1; color: bad; }', 'test');

            strictEqual(Array.isArray(errors.test), true);
            strictEqual(errors.test.length, 2);
        });

        it('filename should be optional', () => {
            const errors = validateString('foo {}');

            deepStrictEqual(Object.keys(errors), ['<unknown>']);
        });
    });

    it('validateDictionary', () => {
        const errors = validateDictionary({
            'foo': 'foo { a: 1; color: bad; }',
            'bar': 'valid {}'
        });

        deepStrictEqual(Object.keys(errors).sort(), ['bar', 'foo']);
        strictEqual(Array.isArray(errors.foo), true);
        strictEqual(errors.foo.length, 2);
        strictEqual(Array.isArray(errors.bar), true);
        strictEqual(errors.bar.length, 0);
    });

    describe('validateFile', () => {
        it('should validate file content', () => {
            const filename = path.join(fixturePath, 'style.css');
            const errors = validateFile(filename);

            deepStrictEqual(Object.keys(errors), [filename]);
            strictEqual(errors[filename].length, 2);
            deepStrictEqual(
                errors[filename].map(error => error.name),
                ['SyntaxReferenceError', 'SyntaxMatchError']
            );
        });

        it('should not fail when file not found', () => {
            const filename = String(Math.random());
            const errors = validateFile(filename);

            deepStrictEqual(Object.keys(errors), [filename]);
            strictEqual(errors[filename].length, 1);
            strictEqual(errors[filename][0].name, 'Error');
        });
    });

    describe('validatePath', () => {
        it('should validate all files with .css extension on path', () => {
            const errors = validatePath(fixturePath);

            deepStrictEqual(
                Object.keys(errors)
                    .map(filename => path.relative(fixturePath, filename))
                    .sort(),
                ['bar/style.css', 'foo/style.css', 'style.css']
            );

            Object.keys(errors).forEach((filename) => {
                strictEqual(errors[filename].length, 2);
                deepStrictEqual(
                    errors[filename].map((error) => error.name),
                    ['SyntaxReferenceError', 'SyntaxMatchError']
                );
            });
        });

        it('should validate all files that match shouldBeValidated on path', () => {
            const errors = validatePath(
                fixturePath,
                filename => path.basename(filename) === 'not.a.css.file'
            );

            deepStrictEqual(
                Object.keys(errors)
                    .map(filename => path.relative(fixturePath, filename))
                    .sort(),
                ['bar/not.a.css.file']
            );

            Object.keys(errors).forEach((filename) => {
                strictEqual(errors[filename].length, 2);
                deepStrictEqual(
                    errors[filename].map((error) => error.name),
                    ['SyntaxReferenceError', 'SyntaxMatchError']
                );
            });
        });

        it('should not fail when path is invalid', () => {
            const path = String(Math.random());
            const errors = validatePath(path);

            deepStrictEqual(Object.keys(errors), [path]);
            strictEqual(errors[path].length, 1);
            strictEqual(errors[path][0].name, 'Error');
        });
    });

    describe('validatePathList', () => {
        it('should validate all files with .css extension on paths', () => {
            const errors = validatePathList([
                path.join(fixturePath, 'bar'),
                path.join(fixturePath, 'foo')
            ]);

            deepStrictEqual(
                Object.keys(errors)
                    .map(filename => path.relative(fixturePath, filename))
                    .sort(),
                ['bar/style.css', 'foo/style.css']
            );

            Object.keys(errors).forEach((filename) => {
                strictEqual(errors[filename].length, 2);
                deepStrictEqual(
                    errors[filename].map((error) => error.name),
                    ['SyntaxReferenceError', 'SyntaxMatchError']
                );
            });
        });

        it('should validate all files that match shouldBeValidated on path', () => {
            const errors = validatePathList([
                path.join(fixturePath, 'bar'),
                path.join(fixturePath, 'foo')
            ], filename => path.basename(filename) === 'not.a.css.file');

            deepStrictEqual(
                Object.keys(errors)
                    .map((filename) => path.relative(fixturePath, filename))
                    .sort(),
                ['bar/not.a.css.file']
            );

            Object.keys(errors).forEach((filename) => {
                strictEqual(errors[filename].length, 2);
                deepStrictEqual(
                    errors[filename].map((error) => error.name),
                    ['SyntaxReferenceError', 'SyntaxMatchError']
                );
            });
        });

        it('should not fail when path is invalid', () => {
            const validPath = path.join(fixturePath, 'bar');
            const invalidPath = Math.random();
            const errors = validatePathList([
                validPath,
                invalidPath
            ]);

            deepStrictEqual(Object.keys(errors), [
                path.join(validPath, 'style.css'),
                String(invalidPath)
            ]);
            strictEqual(errors[path.join(validPath, 'style.css')].length, 2);
            strictEqual(errors[invalidPath].length, 1);
            strictEqual(errors[invalidPath][0].name, 'TypeError');
        });
    });
});
