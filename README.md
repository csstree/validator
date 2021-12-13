[![NPM version](https://img.shields.io/npm/v/csstree-validator.svg)](https://www.npmjs.com/package/csstree-validator)
[![Build Status](https://github.com/csstree/validator/actions/workflows/build.yml/badge.svg)](https://github.com/csstree/validator/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/csstree/validator/badge.svg?branch=master)](https://coveralls.io/github/csstree/validator?branch=master)

# CSSTree Validator

CSS validator built on [CSSTree](https://github.com/csstree/csstree)

## Usage

```bash
> npm install csstree-validator
```

Validate CSS string or [CSSTree's AST](https://github.com/csstree/csstree/blob/master/docs/ast.md):

```js
import { validate } from 'csstree-validator';
// Commonjs:
// const { validate } = require('csstree-validator');

const filename = 'demo/example.css';
const css = '.class { pading: 10px; border: 1px super red }';

console.log(validate(css, filename));
// [
//   SyntaxError [SyntaxReferenceError]: Unknown property `pading` {
//     reference: 'pading',
//     property: 'pading',
//     offset: 9,
//     line: 1,
//     column: 10
//   },
//   SyntaxError [SyntaxMatchError]: Mismatch {
//     message: 'Invalid value for `border` property',
//     rawMessage: 'Mismatch',
//     syntax: '<line-width> || <line-style> || <color>',
//     css: '1px super red',
//     mismatchOffset: 4,
//     mismatchLength: 5,
//     offset: 35,
//     line: 1,
//     column: 36,
//     loc: { source: 'demo/example.css', start: [Object], end: [Object] },
//     property: 'border',
//     details: 'Mismatch\n' +
//       '  syntax: <line-width> || <line-style> || <color>\n' +
//       '   value: 1px super red\n' +
//       '  ------------^'
//   }
// ]
```

Another option is to use helpers to validate a file or a directory and one of buildin reporters:

```js
import { validateFile, reporters } from 'csstree-validator';

console.log(reporters.checkstyle(validateFile('./path/to/style.css')));
```

### Validate methods

* validate(css, filename)
* validateAtrule(node)
* validateAtrulePrelude(atrule, prelude, preludeLoc)
* validateAtruleDescriptor(atrule, descriptor, value, descriptorLoc)
* validateDeclaration(property, value, valueLoc)
* validateRule(node)

## Helpers

All helper function return an object where key is a path to a file and value is an array of errors. The result object is iterable (has `Symbol.iterator`) and can be used with `for ... of` or `...` operator.

```js
const result = validateFile('path/to/file.css');

for (const [filename, errors] of result) {
  // ...
}
```

* validateString(css, filename)
* validateDictionary(dictionary)
* validateFile(filename)
* validatePath(searchPath, filter)
* validatePathList(pathList, filter)

Reporters:

* `json`
* `console`
* `checkstyle`
* `gnu`

## Using in a browser

Available bundles to use in a browser:

- `dist/csstree-validator.js` – minified IIFE with `csstreeValidator` as a global
```html
<script src="node_modules/csstree-validator/dist/csstree-validator.js"></script>
<script>
  const errors = csstreeValidator.validate('.some { css: source }');
</script>
```

- `dist/csstree-validator.esm.js` – minified ES module
```html
<script type="module">
  import { validate } from "csstree-validator/dist/csstree-validator.esm.js";

  const errors = validate('.some { css: source }');
</script>
```

One of CDN services like `unpkg` or `jsDelivr` can be used. By default (for short path) a ESM version is exposing. For IIFE version a full path to a bundle should be specified:

```html
<!-- ESM -->
<script type="module">
  import * as csstreeValidator from 'https://cdn.jsdelivr.net/npm/csstree-validator';
  import * as csstreeValidator from 'https://unpkg.com/csstree-validator';
</script>

<!-- IIFE with csstreeValidator as a global -->
<script src="https://cdn.jsdelivr.net/npm/csstree-validator/dist/csstree-validator.js"></script>
<script src="https://unpkg.com/csstree-validator/dist/csstree-validator.js"></script>
```

NOTE: Helpers and reporters are not available for browser's version.

## CLI (terminal command)

```bash
> npm install -g csstree-validator
> csstree-validator /path/to/style.css
```

```
> csstree-validator -h
Usage:

    csstree-validate [fileOrDir] [options]

Options:

    -h, --help                     Output usage information
    -r, --reporter <nameOrFile>    Output formatter: console (default), checkstyle, json, gnu
                                   or <path to a module>
    -v, --version                  Output version
```

### Custom reporters

In addition to predefined (buildin) reporters, you can specify the path to a module or a package with a custom reporter. Such module should export a single function which takes the validation result object and returns a string:

```js
export default function(result) {
  const output = '';

  for (const [filename, errors] of result) {
    // ...
  }

  return output;
}

// For CommonJS:
// module.exports = function(result) { ... }
```

The specifier for a custom reporter might be:
- ESM module – a full path to a file with `.js` extension
- CommonJS module – a full path to a file with `.cjs` extension
- ESM package – a package name or a full path to package's module (i.e. `package/lib/index.js`)
- CommonJS package – a package name or a path to package's module (i.e. `package/lib/index.js`, `package/lib/index` or `package/lib`)
- Dual package – a package name or a full path to package's module

The resolution algorithm is testing `reporter` option value in the following order:
- If a value is a path to a file (a base dir for relative paths is `process.cwd()`), then use it a module
- If a value is a path to a package module (a base dir for `node_modules` is `process.cwd()`), then use package's module
- Otherwise the value should be a name of one of predifined reporter, or an error will be raised

## Ready to use

Plugins that are using `csstree-validator`:

* [Sublime plugin](https://github.com/csstree/SublimeLinter-contrib-csstree)
* [VS Code plugin](https://github.com/csstree/vscode-plugin)
* [Atom plugin](https://github.com/csstree/atom-plugin)
* [Grunt plugin](https://github.com/sergejmueller/grunt-csstree-validator)
* [Gulp plugin](https://github.com/csstree/gulp-csstree)

## License

MIT
