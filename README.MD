# CSS Tree Validator

### How to use:
**CLI:**
```bash
npm i -g csstree-validator
csstree-validator /path/to/style.css
```
There is several built-in reporters:
- console (default)
- checkstyle
- json

Reporters can be used with `--reporter` argument:
```bash
npm i -g csstree-validator
csstree-validator /path/to/style.css --reporter json
```

**JS**
```js
var validate = require('csstree-validator').validate;
var reporter = require('csstree-validator').reporters.checkstyle;

console.log(reporter(validate(['/path/to/style.css'])));
```