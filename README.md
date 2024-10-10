[![NPM Version](https://img.shields.io/npm/v/csstree-validator.svg)](https://www.npmjs.com/package/csstree-validator)
[![Build Status](https://github.com/csstree/validator/actions/workflows/build.yml/badge.svg)](https://github.com/csstree/validator/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/csstree/validator/badge.svg?branch=master)](https://coveralls.io/github/csstree/validator?branch=master)

# CSSTree Validator

CSS Validator built on [CSSTree](https://github.com/csstree/csstree).

Technically, the package utilizes the capabilities of CSSTree to match CSS syntaxes to various parts of your code and generates a list of errors, if any.

> **Note:** If `csstree-validator` produces false positives or false negatives, such as unknown properties or invalid values for a property, please report the issue to the [CSSTree issue tracker](https://github.com/csstree/csstree/issues).

> **Note:** CSSTree currently doesn't support selector syntax matching; therefore, `csstree-validator` doesn't support it either. Support for selector validation will be added once it is available in CSSTree.

## Installation

Install the package via npm:

```bash
npm install csstree-validator
```

## Usage

You can validate a CSS string or a [CSSTree AST](https://github.com/csstree/csstree/blob/master/docs/ast.md):

```js
import { validate } from 'csstree-validator';
// For CommonJS:
// const { validate } = require('csstree-validator');

const filename = 'demo/example.css';
const css = '.class { pading: 10px; border: 1px super red }';

console.log(validate(css, filename));
// Output:
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

Alternatively, you can use [helper functions](#helpers) to validate a file or directory and utilize one of the built-in [reporters](#reporters):

```js
import { validateFile, reporters } from 'csstree-validator';

const result = validateFile('./path/to/style.css');
console.log(reporters.checkstyle(result));
```

### Validation Methods

- `validate(css, filename)`
- `validateAtrule(node)`
- `validateAtrulePrelude(atrule, prelude, preludeLoc)`
- `validateAtruleDescriptor(atrule, descriptor, value, descriptorLoc)`
- `validateDeclaration(property, value, valueLoc)`
- `validateRule(node)`

## Helpers

> **Note:** Helpers are not available in browser environments as they rely on Node.js APIs.

All helper functions return an object where the key is the path to a file and the value is an array of errors. The result object is iterable (has `Symbol.iterator`) and can be used with `for...of` loops or the spread operator.

Example:

```js
const result = validateFile('path/to/file.css');

for (const [filename, errors] of result) {
  // Process errors
}
```

Available helper functions:

- `validateString(css, filename)`
- `validateDictionary(dictionary)`
- `validateFile(filename)`
- `validatePath(searchPath, filter)`
- `validatePathList(pathList, filter)`

## Reporters

CSSTree Validator provides several built-in reporters to convert validation results into different formats:

- `console` – Human-readable text suitable for console output.
- `json` – Converts errors into a unified JSON array of objects:

  ```ts
  type ErrorEntry = {
    name: string; // Filename
    line: number;
    column: number;
    atrule?: string;
    descriptor?: string;
    property?: string;
    message: string;
    details?: any;
  }
  ```

- `checkstyle` – [Checkstyle](https://checkstyle.sourceforge.io/) XML report format:

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <checkstyle version="4.3">
    <file name="{filename}">
      <error line="{line}" column="{column}" severity="error" message="{message}" source="csstree-validator" />
    </file>
  </checkstyle>
  ```

- `gnu` – GNU error log format:

  ```
  "FILENAME":LINE.COLUMN: error: MESSAGE
  "FILENAME":START_LINE.COLUMN-END_LINE.COLUMN: error: MESSAGE
  ```

Example usage:

```js
import { validate, reporters } from 'csstree-validator';

const css = '.class { padding: 10px; color: red; }';
const result = validate(css, 'example.css');

console.log(reporters.json(result));
// Output:
// [
//   { "name": 'example.css', ... },
//   { "name": 'example.css', ... },
//   ...
// ]
```

## Browser Usage

CSSTree Validator can be used in browser environments using the available bundles:

- **IIFE Bundle (`dist/csstree-validator.js`)** – Minified IIFE with `csstreeValidator` as a global variable.

  ```html
  <script src="node_modules/csstree-validator/dist/csstree-validator.js"></script>
  <script>
    const errors = csstreeValidator.validate('.some { css: source }');
  </script>
  ```

- **ES Module (`dist/csstree-validator.esm.js`)** – Minified ES module.

  ```html
  <script type="module">
    import { validate } from 'csstree-validator/dist/csstree-validator.esm.js';

    const errors = validate('.some { css: source }');
  </script>
  ```

You can also use a CDN service like `unpkg` or `jsDelivr`. By default, the ESM version is exposed for short paths. For the IIFE version, specify the full path to the bundle:

```html
<!-- ESM -->
<script type="module">
  import * as csstreeValidator from 'https://cdn.jsdelivr.net/npm/csstree-validator';
  // or
  import * as csstreeValidator from 'https://unpkg.com/csstree-validator';
</script>

<!-- IIFE with csstreeValidator as a global -->
<script src="https://cdn.jsdelivr.net/npm/csstree-validator/dist/csstree-validator.js"></script>
<!-- or -->
<script src="https://unpkg.com/csstree-validator/dist/csstree-validator.js"></script>
```

**Note:** Helpers are not available in the browser version.

## Command-Line Interface (CLI)

Install globally via npm:

```bash
npm install -g csstree-validator
```

Run the validator on a CSS file:

```bash
csstree-validator /path/to/style.css
```

Display help:

```bash
csstree-validator -h
```

```
Usage:

    csstree-validator [fileOrDir] [options]

Options:

    -h, --help                     Output usage information
    -r, --reporter <nameOrFile>    Output formatter: console (default), checkstyle, json, gnu
                                   or <path to a module>
    -v, --version                  Output version
```

### Custom Reporters

In addition to the built-in reporters, you can specify a custom reporter by providing the path to a module or package. The module should export a single function that takes the validation result object and returns a string:

```js
export default function(result) {
  let output = '';

  for (const [filename, errors] of result) {
    // Generate custom output
  }

  return output;
}

// For CommonJS:
// module.exports = function(result) { ... }
```

The `reporter` option accepts:

- **ESM Module** – Full path to a file with a `.js` extension.
- **CommonJS Module** – Full path to a file with a `.cjs` extension.
- **ESM Package** – Package name or full path to a module within the package.
- **CommonJS Package** – Package name or path to a module within the package.
- **Dual Package** – Package name or full path to a module within the package.

The resolution algorithm checks the `reporter` value in the following order:

1. If it's a path to a file (relative to `process.cwd()`), use it as a module.
2. If it's a path to a package module (relative to `process.cwd()`), use the package's module.
3. Otherwise, the value should be the name of one of the predefined reporters, or an error will be raised.

## Integrations

Plugins that use `csstree-validator`:

- [VS Code Plugin](https://github.com/csstree/vscode-plugin)

## License

MIT
