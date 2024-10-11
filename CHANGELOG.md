## 4.0.1 (October 11, 2024)

- Fixed location properties on validation errors; all errors (excluding parse errors) now include `offset`, `start`, `end`, and `loc` properties

## 4.0.0 (October 10, 2024)

- Bumped `csstree` to [^3.0.0](https://github.com/csstree/csstree/releases/tag/v3.0.0)
- Added default reporters into bundle entry points
- Fixed the resolution of a path to a reporter by employing `enhanced-resolve`, which now considers the `exports` field in `package.json`
- Fixed `package.json` for bundling for browser environments

## 3.0.0 (December 13, 2021)

- Added custom reporters support in CLI, e.g. `csstree-validator --reporter path/to/reporter.js` or `csstree-validator --reporter reporter-package`
- Added `Symbol.iterator` for `validateString()`, `validateDictionary()`, `validateFile()`, `validatePathList()` and `validatePath()` result value, i.e. it now can be used with `for ... of` for example `for (const [filename, errors] of result) ...`
- Bumped `csstree` to [2.0](https://github.com/csstree/csstree/releases/tag/v2.0.0)
- Package
    - Changed supported versions of Node.js to `^12.20.0`, `^14.13.0` and `>=15.0.0`
    - Converted to ES modules. However, CommonJS is supported as well (dual module)
    - Added bundle `dist/csstree-validator.esm.js` as ES module

## 2.0.1 (March 31, 2021)

- Fixed wrong `require()` in CLI that causes to crash
- Bumped `csstree` to [1.1.3](https://github.com/csstree/csstree/releases/tag/v1.1.1) to fix the issue with parsing that causes to a failure on a value with function/brackets and `!important` (#18)

## 2.0.0 (November 18, 2020)

- Droped support for Nodejs < 8
- Bumped `csstree` to [1.1.1](https://github.com/csstree/csstree/releases/tag/v1.1.1)
- CLI exits with code `1` and outputs messages to `stderr` when errors (#12)
- Added built version for browsers: `dist/csstree-validator.js` (#11)
- Added at-rule validation for name, prelude and descriptor
- Added `validateAtrule`, `validateAtrulePrelude`, `validateAtruleDescriptor`, `validateRule` and `validateDeclaration` methods

## 1.6.0 (October 27, 2020)

- Bumped `csstree` to [1.0.0](https://github.com/csstree/csstree/releases/tag/v1.0.0)

## 1.5.1 (October 7, 2019)

- Updated `csstree` to [1.0.0-alpha.34](https://github.com/csstree/csstree/releases/tag/v1.0.0-alpha.34)

## 1.5.0 (July 11, 2019)

- Updated `csstree` to [1.0.0-alpha.32](https://github.com/csstree/csstree/releases/tag/v1.0.0-alpha.32)

## 1.4.0 (May 30, 2018)

- Updated `csstree` to [1.0.0-alpha.29](https://github.com/csstree/csstree/releases/tag/v1.0.0-alpha.29)

## 1.3.1 (February 19, 2018)

- Updated `csstree` to 1.0.0-alpha.28

## 1.3.0 (November 12, 2017)

- Added `gnu` reporter (@sideshowbarker, #8)
- Updated `csstree` to 1.0.0-alpha.26

## 1.2.1 (September 14, 2017)

- Updated `csstree` to 1.0.0-alpha24 (minor bug fixes)

## 1.2.0 (September 4, 2017)

- Updated `csstree` to [1.0.0-alpha21](https://github.com/csstree/csstree/releases/tag/v1.0.0-alpha21)
- Use tolerant mode to parse a CSS. Since now a single parse error doesn't prevent validation of a whole CSS.

## 1.1.0 (August 28, 2017)

- Updated `csstree` to [1.0.0-alpha20](https://github.com/csstree/csstree/releases/tag/v1.0.0-alpha20)
- Changed validate function to always contain a list of errors (no single error on parse error)
- Added `validateDictionary()` that validate a dictionary, where key is a filename and value is a CSS as string
- Changed `validateFile()`, `validatePath()` and `validatePathList()` to handle possible file system exceptions (such errors will be stored as regular errors)
- Added second argument for `validatePath()` and `validatePathList()` to rule which file should be validated. Functions validate files with `.css` extension only, when second parameter is not passed.
- Fixed minor issues in reporters output

## 1.0.8 (January 19, 2017)

- Added `loc` to mismatch errors when possible
- Fixed wrong `source` in node `loc`
- Updated `csstree` to `1.0.0-alpha13`

## 1.0.7 (January 19, 2017)

- Updated `csstree` to `1.0.0-alpha12`

## 1.0.6 (December 23, 2016)

- Updated `csstree` to `1.0.0-alpha9`

## 1.0.5 (November 11, 2016)

- Updated `csstree` to `1.0.0-alpha8`

## 1.0.4 (October 8, 2016)

- Updated `csstree` to `1.0.0-alpha7`

## 1.0.3 (September 23, 2016)

- Updated `csstree` to `1.0.0-alpha6` (it was not updated by mistake)

## 1.0.2 (September 23, 2016)

- Updated `csstree` to `1.0.0-alpha6`
- Use syntax validation error line and column when possible to more accurately indicate problem location
- Improved message output for default reporter
- Fixed CSS parse error output (or any other exception during validate)

## 1.0.0 (September 17, 2016)

- Initial implementation
