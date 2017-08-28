var fs = require('fs');
var path = require('path');
var assert = require('assert');
var validateString = require('../lib/validate').validateString;
var reporters = require('../lib/reporter');
var input = {
    parse: 'foo { boom! }',
    match: '.warn { color: 123; border: 1px unknown red; unknown: yep; --custom: property }'
};

function createReporterTest(name, reporter) {
    it(name + ' parse errors', function() {
        var expected = fs.readFileSync(path.join(__dirname, 'fixture/reporter/' + name + '.parse'), 'utf8').trim();
        var actual = reporter(validateString(input.parse, 'test')).trim();

        assert.equal(actual, expected);
    });

    it(name + ' match errors', function() {
        var expected = fs.readFileSync(path.join(__dirname, 'fixture/reporter/' + name + '.match'), 'utf8').trim();
        var actual = reporter(validateString(input.match, 'test')).trim();

        assert.equal(actual, expected);
    });
}

describe('test reporter output', function() {
    for (var name in reporters) {
        createReporterTest(name, reporters[name]);
    }
});
