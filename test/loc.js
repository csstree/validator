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
    });

    it('result should contain correct location of mismatch', function() {
        const error = validateString('.broken {\n  color: rgb(1, green, 3);\n}', 'test').test[0];

        assert.strictEqual(error.message, 'Invalid value for `color` property');
        assert.strictEqual(error.line, 2);
        assert.strictEqual(error.column, 17);
    });

    it('result should contain correct location of uncomplete mismatch', function() {
        const error = validateString('.broken {\n  border: red 1xx solid;\n}', 'test').test[0];

        assert.strictEqual(error.message, 'Invalid value for `border` property');
        assert.strictEqual(error.line, 2);
        assert.strictEqual(error.column, 15);
    });

    it('should not warn on custom properties', function() {
        const error = validateString('.broken { --foo: 123 }', 'test').test;

        assert.deepStrictEqual(error, []);
    });
});
