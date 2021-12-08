/* global csstreeValidator */
const assert = require('assert');
const fs = require('fs');

it('csstree-validator.js', () => {
    eval(fs.readFileSync('dist/csstree-validator.js', 'utf8'));
    const actual = csstreeValidator.validate('.test { color: gren; colo: #ff0000; }');

    assert.deepStrictEqual(
        actual.map(error => error.message),
        [
            'Invalid value for `color` property',
            'Unknown property `colo`'
        ]
    );
});
