import assert from 'assert';
import { validate } from '../csstree-validator.esm.js';

it('csstree-validator.esm.js', () => {
    const actual = validate('.test { color: gren; colo: #ff0000; }');

    assert.deepStrictEqual(
        actual.map(error => error.message),
        [
            'Invalid value for `color` property',
            'Unknown property `colo`'
        ]
    );
});
