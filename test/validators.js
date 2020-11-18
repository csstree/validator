const path = require('path');
const assert = require('assert');
const fn = require('../lib');
const fixturePath = path.join(__dirname, 'fixture/css');

describe('validators', function() {
    describe('validateString', function() {
        it('should validate errors in CSS string', function() {
            const errors = fn.validateString('foo { a: 1; color: bad; }', 'test');

            assert.strictEqual(Array.isArray(errors.test), true);
            assert.strictEqual(errors.test.length, 2);
        });

        it('filename should be optional', function() {
            const errors = fn.validateString('foo {}');

            assert.deepStrictEqual(Object.keys(errors), ['<unknown>']);
        });
    });

    it('validateDictionary', function() {
        const errors = fn.validateDictionary({
            'foo': 'foo { a: 1; color: bad; }',
            'bar': 'valid {}'
        });

        assert.deepStrictEqual(Object.keys(errors).sort(), ['bar', 'foo']);
        assert.strictEqual(Array.isArray(errors.foo), true);
        assert.strictEqual(errors.foo.length, 2);
        assert.strictEqual(Array.isArray(errors.bar), true);
        assert.strictEqual(errors.bar.length, 0);
    });

    describe('validateFile', function() {
        it('should validate file content', function() {
            const filename = path.join(fixturePath, 'style.css');
            const errors = fn.validateFile(filename);

            assert.deepStrictEqual(Object.keys(errors), [filename]);
            assert.strictEqual(errors[filename].length, 2);
            assert.deepStrictEqual(errors[filename].map(function(error) {
                return error.name;
            }), ['SyntaxReferenceError', 'SyntaxMatchError']);
        });

        it('should not fail when file not found', function() {
            const filename = String(Math.random());
            const errors = fn.validateFile(filename);

            assert.deepStrictEqual(Object.keys(errors), [filename]);
            assert.strictEqual(errors[filename].length, 1);
            assert.strictEqual(errors[filename][0].name, 'Error');
        });
    });

    describe('validatePath', function() {
        it('should validate all files with .css extension on path', function() {
            const errors = fn.validatePath(fixturePath);

            assert.deepStrictEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/style.css', 'foo/style.css', 'style.css']);

            Object.keys(errors).forEach(function(filename) {
                assert.strictEqual(errors[filename].length, 2);
                assert.deepStrictEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should validate all files that match shouldBeValidated on path', function() {
            const errors = fn.validatePath(fixturePath, function(filename) {
                return path.basename(filename) === 'not.a.css.file';
            });

            assert.deepStrictEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/not.a.css.file']);

            Object.keys(errors).forEach(function(filename) {
                assert.strictEqual(errors[filename].length, 2);
                assert.deepStrictEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should not fail when path is invalid', function() {
            const path = String(Math.random());
            const errors = fn.validatePath(path);

            assert.deepStrictEqual(Object.keys(errors), [path]);
            assert.strictEqual(errors[path].length, 1);
            assert.strictEqual(errors[path][0].name, 'Error');
        });
    });

    describe('validatePathList', function() {
        it('should validate all files with .css extension on paths', function() {
            const errors = fn.validatePathList([
                path.join(fixturePath, 'bar'),
                path.join(fixturePath, 'foo')
            ]);

            assert.deepStrictEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/style.css', 'foo/style.css']);

            Object.keys(errors).forEach(function(filename) {
                assert.strictEqual(errors[filename].length, 2);
                assert.deepStrictEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should validate all files that match shouldBeValidated on path', function() {
            const errors = fn.validatePathList([
                path.join(fixturePath, 'bar'),
                path.join(fixturePath, 'foo')
            ], function(filename) {
                return path.basename(filename) === 'not.a.css.file';
            });

            assert.deepStrictEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/not.a.css.file']);

            Object.keys(errors).forEach(function(filename) {
                assert.strictEqual(errors[filename].length, 2);
                assert.deepStrictEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should not fail when path is invalid', function() {
            const validPath = path.join(fixturePath, 'bar');
            const invalidPath = Math.random();
            const errors = fn.validatePathList([
                validPath,
                invalidPath
            ]);

            assert.deepStrictEqual(Object.keys(errors), [
                path.join(validPath, 'style.css'),
                String(invalidPath)
            ]);
            assert.strictEqual(errors[path.join(validPath, 'style.css')].length, 2);
            assert.strictEqual(errors[invalidPath].length, 1);
            assert.strictEqual(errors[invalidPath][0].name, 'Error');
        });
    });
});
