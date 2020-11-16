const assert = require('assert');
const { validateString } = require('../lib');

describe('locations', function() {
    it('result should contain correct parse error location', function() {
        const error = validateString('.broken {\n  a;\n}', 'test').test[0];

        assert.strictEqual(error.line, 2, 'line');
        assert.strictEqual(error.column, 4, 'column');
        assert.strictEqual(error.offset, 13, 'offset');
    });

    it('result should contain correct location of unknown property', function() {
        const error = validateString('.broken {\n  abc: 1;\n}', 'test').test[0];

        assert.strictEqual(error.message, 'Unknown property `abc`');
        assert.strictEqual(error.line, 2);
        assert.strictEqual(error.column, 3);
        assert.deepStrictEqual(error.loc, {
            source: 'test',
            start: {
                offset: 12,
                line: 2,
                column: 3
            },
            end: {
                offset: 18,
                line: 2,
                column: 9
            }
        });
    });

    it('result should contain correct location of mismatch', function() {
        const error = validateString('.broken {\n  color: rgb(1, green, 3);\n}', 'test').test[0];

        assert.strictEqual(error.message, 'Invalid value for `color`');
        assert.strictEqual(error.line, 2);
        assert.strictEqual(error.column, 17);
        assert.deepStrictEqual(error.loc, {
            source: 'test',
            start: {
                offset: 26,
                line: 2,
                column: 17
            },
            end: {
                offset: 31,
                line: 2,
                column: 22
            }
        });
    });

    it('result should contain correct location of uncomplete mismatch', function() {
        const error = validateString('.broken {\n  border: red 1xx solid;\n}', 'test').test[0];

        assert.strictEqual(error.message, 'Invalid value for `border`');
        assert.strictEqual(error.line, 2);
        assert.strictEqual(error.column, 15);
        assert.deepStrictEqual(error.loc, {
            source: 'test',
            start: {
                offset: 24,
                line: 2,
                column: 15
            },
            end: {
                offset: 27,
                line: 2,
                column: 18
            }
        });
    });

    it('should not warn on custom properties', function() {
        const error = validateString('.broken { --foo: 123 }', 'test').test;

        assert.deepStrictEqual(error, []);
    });
});
