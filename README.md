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
var validate = require('csstree-validator').validate;
var reporter = require('csstree-validator').reporters.checkstyle;

console.log(reporter(validate.byPaths(['/path/to/style.css'])));
// or
console.log(reporter(validate.byContent('<some raw css>')));
```
