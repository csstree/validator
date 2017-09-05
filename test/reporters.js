var fs = require('fs');
var path = require('path');
var assert = require('assert');
var validateDictionary = require('../lib/validate').validateDictionary;
var reporters = require('../lib/reporter');
var input = {
    'parse.css': 'foo { boom! } bar { color: red green; }',
    'match.css': '.warn { color: 123; border: 1px unknown red; unknown: yep; --custom: property }'
};

function createReporterTest(name, reporter) {
    it(name, function() {
        var expected = fs.readFileSync(path.join(__dirname, 'fixture/reporter/' + name), 'utf8').trim();
        var actual = reporter(validateDictionary(input)).trim();

        assert.equal(actual, expected);
    });
}

describe('test reporter output', function() {
    for (var name in reporters) {
        createReporterTest(name, reporters[name]);
    }
});
