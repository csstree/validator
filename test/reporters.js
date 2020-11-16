const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { validateDictionary, reporters } = require('../lib');
const input = {
    'parse.css': 'foo { boom! } bar { color: red green; }',
    'match.css': '.warn { color: 123; border: 1px unknown red; unknown: yep; --custom: property }'
};

function createReporterTest(name, reporter) {
    it(name, function() {
        const expected = fs.readFileSync(path.join(__dirname, 'fixture/reporter/' + name), 'utf8').trim();
        const actual = reporter(validateDictionary(input)).trim();

        assert.strictEqual(actual, expected);
    });
}

describe('test reporter output', function() {
    for (const name in reporters) {
        createReporterTest(name, reporters[name]);
    }
});
