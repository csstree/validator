[![NPM version](https://img.shields.io/npm/v/csstree-validator.svg)](https://www.npmjs.com/package/csstree-validator)
[![Build Status](https://travis-ci.org/csstree/validator.svg?branch=master)](https://travis-ci.org/csstree/validator)

# CSS Tree Validator

CSS validator built on [CSSTree](https://github.com/csstree/csstree)

## How to use:

### NPM package

```bash
> npm install csstree-validator
```

Manualy validate CSS string or [CSSTree's AST](https://github.com/csstree/csstree/blob/master/docs/ast.md):

```js
const { validate } = require('./lib');

console.log(validate('.class { pading: 10px; border: 1px super red }', 'demo/example.css'));
// [
//   SyntaxError [SyntaxReferenceError]: Unknown property `pading` {
//     reference: 'pading',
//     property: 'pading',
//     offset: 9,
//     line: 1,
//     column: 10
//   },
//  SyntaxError [SyntaxMatchError]: Mismatch {
//    message: 'Invalid value for `border` property',
//    rawMessage: 'Mismatch',
//    syntax: '<line-width> || <line-style> || <color>',
//    css: '1px super red',
//    mismatchOffset: 4,
//    mismatchLength: 5,
//    offset: 35,
//    line: 1,
//    column: 36,
//    loc: { source: 'demo/example.css', start: [Object], end: [Object] },
//    property: 'border',
//    details: 'Mismatch\n' +
//      '  syntax: <line-width> || <line-style> || <color>\n' +
//      '   value: 1px super red\n' +
//      '  ------------^'
//  }
// ]
```

Another option is to use helpers to validate a file or directory and buildin reporters:

```js
const { validateFile } = require('csstree-validator');
const reporter = require('csstree-validator').reporters.checkstyle;

console.log(reporter(validateFile('/path/to/style.css')));
```

#### API

Validate methods:

* validateAtrule(node)
* validateAtrulePrelude(atrule, prelude, preludeLoc)
* validateAtruleDescriptor(atrule, descriptor, value, descriptorLoc)
* validateDeclaration(property, value, valueLoc)
* validateRule(node)
* validate(css, filename)

Helpers:

* validateDictionary(dictionary)
* validateString(css, filename)
* validateFile(filename)
* validateFileList(list)
* validatePath(searchPath, filter)
* validatePathList(pathList, filter)

Reporters

* json
* console
* checkstyle
* gnu

### CLI (terminal command)

```bash
> npm install -g csstree-validator
> csstree-validator /path/to/style.css
```

```
> csstree-validator -h
Usage:

  csstree-validate [fileOrDir] [options]

Options:

  -h, --help               Output usage information
  -r, --reporter <name>    Format of output: console (default), checkstyle, json, gnu
  -v, --version            Output version
```

## Ready to use

Plugins that are using `csstree-validator`:

* [Sublime plugin](https://github.com/csstree/SublimeLinter-contrib-csstree)
* [VS Code plugin](https://github.com/csstree/vscode-plugin)
* [Atom plugin](https://github.com/csstree/atom-plugin)
* [Grunt plugin](https://github.com/sergejmueller/grunt-csstree-validator)
* [Gulp plugin](https://github.com/csstree/gulp-csstree)

## License

MIT
