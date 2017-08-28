var path = require('path');
var assert = require('assert');
var fn = require('../lib/validate');
var fixturePath = path.join(__dirname, 'fixture/css');

describe('validate functions', function() {
    describe('validateString', function() {
        it('should validate errors in CSS string', function() {
            var errors = fn.validateString('foo { a: 1; color: bad; }', 'test');

            assert.equal(Array.isArray(errors.test), true);
            assert.equal(errors.test.length, 2);
        });

        it('filename should be optional', function() {
            var errors = fn.validateString('foo {}');

            assert.deepEqual(Object.keys(errors), ['<unknown>']);
        });
    });

    it('validateDictionary', function() {
        var errors = fn.validateDictionary({
            'foo': 'foo { a: 1; color: bad; }',
            'bar': 'valid {}'
        });

        assert.deepEqual(Object.keys(errors).sort(), ['bar', 'foo']);
        assert.equal(Array.isArray(errors.foo), true);
        assert.equal(errors.foo.length, 2);
        assert.equal(Array.isArray(errors.bar), true);
        assert.equal(errors.bar.length, 0);
    });

    describe('validateFile', function() {
        it('should validate file content', function() {
            var filename = path.join(fixturePath, 'style.css');
            var errors = fn.validateFile(filename);

            assert.deepEqual(Object.keys(errors), [filename]);
            assert.equal(errors[filename].length, 2);
            assert.deepEqual(errors[filename].map(function(error) {
                return error.name;
            }), ['SyntaxReferenceError', 'SyntaxMatchError']);
        });

        it('should not fail when file not found', function() {
            var filename = Math.random();
            var errors = fn.validateFile(filename);

            assert.deepEqual(Object.keys(errors), [filename]);
            assert.equal(errors[filename].length, 1);
            assert.equal(errors[filename][0].name, 'TypeError');
        });
    });

    describe('validatePath', function() {
        it('should validate all files with .css extension on path', function() {
            var errors = fn.validatePath(fixturePath);

            assert.deepEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/style.css', 'foo/style.css', 'style.css']);

            Object.keys(errors).forEach(function(filename) {
                assert.equal(errors[filename].length, 2);
                assert.deepEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should validate all files that match shouldBeValidated on path', function() {
            var errors = fn.validatePath(fixturePath, function(filename) {
                return path.basename(filename) === 'not.a.css.file';
            });

            assert.deepEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/not.a.css.file']);

            Object.keys(errors).forEach(function(filename) {
                assert.equal(errors[filename].length, 2);
                assert.deepEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should not fail when path is invalid', function() {
            var path = Math.random();
            var errors = fn.validatePath(path);

            assert.deepEqual(Object.keys(errors), [path]);
            assert.equal(errors[path].length, 1);
            assert.equal(errors[path][0].name, 'TypeError');
        });
    });

    describe('validatePathList', function() {
        it('should validate all files with .css extension on paths', function() {
            var errors = fn.validatePathList([
                path.join(fixturePath, 'bar'),
                path.join(fixturePath, 'foo')
            ]);

            assert.deepEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/style.css', 'foo/style.css']);

            Object.keys(errors).forEach(function(filename) {
                assert.equal(errors[filename].length, 2);
                assert.deepEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should validate all files that match shouldBeValidated on path', function() {
            var errors = fn.validatePathList([
                path.join(fixturePath, 'bar'),
                path.join(fixturePath, 'foo')
            ], function(filename) {
                return path.basename(filename) === 'not.a.css.file';
            });

            assert.deepEqual(Object.keys(errors).map(function(filename) {
                return path.relative(fixturePath, filename);
            }).sort(), ['bar/not.a.css.file']);

            Object.keys(errors).forEach(function(filename) {
                assert.equal(errors[filename].length, 2);
                assert.deepEqual(errors[filename].map(function(error) {
                    return error.name;
                }), ['SyntaxReferenceError', 'SyntaxMatchError']);
            });
        });

        it('should not fail when path is invalid', function() {
            var validPath = path.join(fixturePath, 'bar');
            var invalidPath = Math.random();
            var errors = fn.validatePathList([
                validPath,
                invalidPath
            ]);

            assert.deepEqual(Object.keys(errors), [
                path.join(validPath, 'style.css'),
                String(invalidPath)
            ]);
            assert.equal(errors[path.join(validPath, 'style.css')].length, 2);
            assert.equal(errors[invalidPath].length, 1);
            assert.equal(errors[invalidPath][0].name, 'Error');
        });
    });
});
