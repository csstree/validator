import { strictEqual, deepStrictEqual } from 'assert';
import { validate } from 'csstree-validator';

function assertError(css, loc, expectedMsg) {
    const res = validate(css);

    strictEqual(Array.isArray(res), true, 'should return an array of errors');
    strictEqual(res.length > 0, true, 'should return errors');
    deepStrictEqual(res[0].message, expectedMsg);

    if (loc) {
        const { offset, line, column } = res[0];
        const expectedOffset = loc.length - 1 - (css.slice(0, loc.length - 1).match(/\n/g) || []).length;
        const lines = css.slice(0, expectedOffset).split(/\n/);

        deepStrictEqual({ offset, line, column }, {
            offset: expectedOffset,
            line: lines.length,
            column: lines.pop().length + 1
        });
    }
}

function assertOk(css) {
    deepStrictEqual(validate(css), []);
}

describe('validate functions', function() {
    describe('declaration', () => {
        it('unknown property', () =>
            assertError(
                '.a {\n  foo: 123;\n}',
                '        ^',
                'Unknown property `foo`'
            )
        );

        it('bad value', () =>
            assertError(
                '.a {\n  color: 123;\n}',
                '               ^',
                'Invalid value for `color` property'
            )
        );

        it('bad value #2', () =>
            assertError(
                '.a {\n  color: red green;\n}',
                '                   ^',
                'Invalid value for `color` property'
            )
        );

        it('bad value #3', () =>
            assertError(
                '.a {\n  border: 1px unknown red;\n}',
                '                    ^',
                'Invalid value for `border` property'
            )
        );

        it('ok', () =>
            assertOk('.a {\n  color: green;\n  width: calc(1px + 1%)!important\n}')
        );
    });

    describe('atrule', () => {
        it('unknown at-rule', () =>
            assertError(
                '@a { color: green }',
                '^',
                'Unknown at-rule `@a`'
            )
        );

        it('at-rule has no prelude', () =>
            assertError(
                '@font-face xxx { color: green }',
                '           ^',
                'At-rule `@font-face` should not contain a prelude'
            )
        );

        it('at-rule should has a prelude', () =>
            assertError(
                '@document { color: green }',
                '^',
                'At-rule `@document` should contain a prelude'
            )
        );

        it('bad value for at-rule prelude', () =>
            assertError(
                '@document domain( foo /***/) { }',
                '                  ^',
                'Invalid value for `@document` prelude'
            )
        );

        it('ok at-rule prelude', () =>
            assertOk('@document url(foo) { }')
        );

        it('bad at-rule descriptor', () =>
            assertError(
                '@font-face { color: green }',
                '             ^',
                'Unknown at-rule descriptor `color`'
            )
        );

        it('bad at-rule descriptor value', () =>
            assertError(
                '@font-face { font-display: foo }',
                '                           ^',
                'Invalid value for `font-display` descriptor'
            )
        );

        it('ok at-rule descriptor', () =>
            assertOk('@font-face { font-display: swap }')
        );
    });
});
