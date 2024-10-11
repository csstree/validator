import { strictEqual, deepStrictEqual } from 'assert';
import { parse } from 'css-tree';
import { validate } from 'csstree-validator';

function assertIsObject(value, message) {
    strictEqual(typeof value === 'object' && value !== null, true, message);
}

function assertPosition(actual, expected, type) {
    assertIsObject(actual, `${type} on error must be an object`);
    deepStrictEqual(actual, expected, `${type} on error`);
}

function assertError(css, expectedLoc, expectedMsg, locIsOptional) {
    const res = validate(css);

    strictEqual(Array.isArray(res), true, 'should return an array of errors');
    strictEqual(res.length > 0, true, 'should return errors');

    const entry = res[0];

    deepStrictEqual(entry.message, expectedMsg);

    if (typeof expectedLoc === 'string') {
        const { offset, line, column } = entry;
        const locMatch = expectedLoc.match(/\S+/);
        const expectedStartOffset = locMatch.index - (css.slice(0, expectedLoc.length - 1).match(/\n/g) || []).length;
        const expectedEndOffset = Math.min(expectedStartOffset + locMatch[0].length, css.length);
        const startLines = css.slice(0, expectedStartOffset).split(/\n/);
        const middleLines = css.slice(expectedStartOffset, expectedEndOffset).split(/\n/);
        const expectedStart = {
            offset: expectedStartOffset,
            line: startLines.length,
            column: startLines.pop().length + 1
        };
        const expectedEndLine = expectedStart.line + middleLines.length - 1;
        const expectedEnd = {
            offset: expectedEndOffset,
            line: expectedEndLine,
            column: (expectedEndLine === expectedStart.line ? expectedStart.column : -1) +
                middleLines.pop().length
        };
        // const expected

        // console.log(entry);
        deepStrictEqual({ offset, line, column }, expectedStart, 'offset/line/column on error');

        if (!locIsOptional || entry.loc) {
            assertIsObject(entry.loc, 'loc on error must be an object');
            strictEqual(typeof entry.loc.source, 'string', 'loc.source must be a string');
            assertPosition(entry.loc.start, expectedStart, 'start');
            assertPosition(entry.loc.end, expectedEnd, 'end');
        }
    } else {
        const { offset, line, column } = entry;

        deepStrictEqual({ offset, line, column }, expectedLoc);
    }
}

function assertOk(css) {
    deepStrictEqual(validate(css), []);
}

describe('validate functions', function() {
    it('validate() should take AST', () => {
        const ast = parse('.a {\n  foo: 123;\n}', { positions: true });

        assertError(
            ast,
            { offset: 7, line: 2, column: 3 },
            'Unknown property `foo`'
        );
    });

    describe('parse error', () => {
        it('somewhere in the input', () => {
            assertError(
                'foo { boom! }',
                '          ^',
                'Colon is expected',
                true
            );
        });
        it('at end of the input', () => {
            assertError(
                'a',
                ' ^',
                '"{" is expected',
                true
            );
        });
    });

    describe('declaration', () => {
        it('unknown property', () =>
            assertError(
                '.a {\n  foo: 123;\n}',
                '        ~~~',
                'Unknown property `foo`'
            )
        );

        it('bad value', () =>
            assertError(
                '.a {\n  color: 123;\n}',
                '               ~~~',
                'Invalid value for `color` property'
            )
        );

        it('bad value #2', () =>
            assertError(
                '.a {\n  color: red green;\n}',
                '                   ~~~~~',
                'Invalid value for `color` property'
            )
        );

        it('bad value #3', () =>
            assertError(
                '.a {\n  border: 1px unknown red;\n}',
                '                    ~~~~~~~',
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
                '~~',
                'Unknown at-rule `@a`'
            )
        );

        it('at-rule should has no prelude', () =>
            assertError(
                '@font-face xxx { color: green }',
                '           ~~~',
                'At-rule `@font-face` should not contain a prelude'
            )
        );

        it('at-rule should has no prelude #2', () =>
            assertError(
                '@font-face xxx yyy { color: green }',
                '           ~~~~~~~',
                'At-rule `@font-face` should not contain a prelude'
            )
        );

        it('at-rule should has a prelude', () =>
            assertError(
                '@document { color: green }',
                '~~~~~~~~~',
                'At-rule `@document` should contain a prelude'
            )
        );

        it('bad value for at-rule prelude', () =>
            assertError(
                '@document domain( foo /***/) { }',
                '                  ~~~',
                'Invalid value for `@document` prelude'
            )
        );

        it('ok at-rule prelude', () =>
            assertOk('@document url(foo) { }')
        );

        it('bad at-rule descriptor', () =>
            assertError(
                '@font-face { color: green }',
                '             ~~~~~',
                'Unknown at-rule descriptor `color`'
            )
        );

        it('bad at-rule descriptor value', () =>
            assertError(
                '@font-face { font-display: foo bar }',
                '                           ~~~',
                'Invalid value for `font-display` descriptor'
            )
        );

        it('ok at-rule descriptor', () =>
            assertOk('@font-face { font-display: swap }')
        );
    });
});
