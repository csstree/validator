import { readFileSync } from 'fs';
import { strictEqual } from 'assert';
import { validateDictionary, reporters } from 'csstree-validator';

const input = {
    'parse.css': 'foo { boom! } bar { color: red green; }',
    'match.css': '.warn { color: 123; border: 1px unknown red; unknown: yep; --custom: property }'
};

function createReporterTest(name, reporter) {
    it(name, () => {
        const expected = readFileSync('./fixtures/reporter/' + name, 'utf8').trim();
        const actual = reporter(validateDictionary(input)).trim();

        strictEqual(actual, expected);
    });
}

describe('test reporter output', () => {
    for (const name in reporters) {
        createReporterTest(name, reporters[name]);
    }
});
