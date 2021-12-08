import { strictEqual, deepStrictEqual } from 'assert';
import { validateString } from 'csstree-validator';

describe('locations', () => {
    it('result should contain correct parse error location', () => {
        const error = validateString('.broken {\n  a;\n}', 'test').test[0];

        strictEqual(error.line, 2, 'line');
        strictEqual(error.column, 4, 'column');
        strictEqual(error.offset, 13, 'offset');
    });

    it('result should contain correct location of unknown property', () => {
        const error = validateString('.broken {\n  abc: 1;\n}', 'test').test[0];

        strictEqual(error.message, 'Unknown property `abc`');
        strictEqual(error.line, 2);
        strictEqual(error.column, 3);
    });

    it('result should contain correct location of mismatch', () => {
        const error = validateString('.broken {\n  color: rgb(1, green, 3);\n}', 'test').test[0];

        strictEqual(error.message, 'Invalid value for `color` property');
        strictEqual(error.line, 2);
        strictEqual(error.column, 17);
    });

    it('result should contain correct location of uncomplete mismatch', () => {
        const error = validateString('.broken {\n  border: red 1xx solid;\n}', 'test').test[0];

        strictEqual(error.message, 'Invalid value for `border` property');
        strictEqual(error.line, 2);
        strictEqual(error.column, 15);
    });

    it('should not warn on custom properties', () => {
        const error = validateString('.broken { --foo: 123 }', 'test').test;

        deepStrictEqual(error, []);
    });
});
