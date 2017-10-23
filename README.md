[![NPM version](https://img.shields.io/npm/v/csstree-validator.svg)](https://www.npmjs.com/package/csstree-validator)
[![Build Status](https://travis-ci.org/csstree/validator.svg?branch=master)](https://travis-ci.org/csstree/validator)

# CSS Tree Validator

## How to use:

```bash
> npm i -g csstree-validator
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

## API

```js
var validateFile = require('csstree-validator').validateFile;
var reporter = require('csstree-validator').reporters.checkstyle;

console.log(reporter(validateFile('/path/to/style.css')));
```

## Ready to use

Some plugins that are using `csstree-validator`:

* [Sublime plugin](https://github.com/csstree/SublimeLinter-contrib-csstree)
* [VS Code plugin](https://github.com/csstree/vscode-plugin)
* [Atom plugin](https://github.com/csstree/atom-plugin)
* [Grunt plugin](https://github.com/sergejmueller/grunt-csstree-validator)
* [Gulp plugin](https://github.com/csstree/gulp-csstree)

## License

MIT
