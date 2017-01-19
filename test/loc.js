var assert = require('assert');
var validateString = require('../lib/validate').validateString;

describe('locations', function() {
    it('result should contain correct parse error location', function() {
        var error = validateString('.broken {\n  a;\n}', 'test').test;

        assert.equal(error.line, 2, 'line');
        assert.equal(error.column, 4, 'column');
        assert.equal(error.offset, 13, 'offset');
    });

    it('result should contain correct location of unknown property', function() {
        var error = validateString('.broken {\n  abc: 1;\n}', 'test').test[0];

        assert.equal(error.message, 'Unknown property: abc');
        assert.equal(error.line, 2);
        assert.equal(error.column, 3);
        assert.deepEqual(error.loc, {
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
        var error = validateString('.broken {\n  color: rgb(1, green, 3);\n}', 'test').test[0];

        assert.equal(error.message, 'Invalid value for `color`');
        assert.equal(error.line, 2);
        assert.equal(error.column, 17);
        assert.deepEqual(error.loc, {
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
        var error = validateString('.broken {\n  border: red 1xx solid;\n}', 'test').test[0];

        assert.equal(error.message, 'The rest part of value can\'t to be matched on `border` syntax');
        assert.equal(error.line, 2);
        assert.equal(error.column, 15);
        assert.deepEqual(error.loc, {
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
});
