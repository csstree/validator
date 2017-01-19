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
  -r, --reporter <name>    Format of output: console (default), checkstyle, json
  -v, --version            Output version
```

## API

```js
var validate = require('csstree-validator').validateFile;
var reporter = require('csstree-validator').reporters.checkstyle;

console.log(reporter(validateFile('/path/to/style.css')));
```
