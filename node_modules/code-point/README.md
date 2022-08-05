# code-point.js

[![NPM version](https://img.shields.io/npm/v/code-point.svg)](https://www.npmjs.com/package/code-point)
[![Bower version](https://img.shields.io/bower/v/code-point.svg)](https://github.com/shinnn/code-point.js/releases)
[![Build Status](https://travis-ci.org/shinnn/code-point.js.svg?branch=master)](https://travis-ci.org/shinnn/code-point.js)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/code-point.js.svg)](https://coveralls.io/r/shinnn/code-point.js)
[![devDependency Status](https://david-dm.org/shinnn/code-point.js/dev-status.svg)](https://david-dm.org/shinnn/code-point.js#info=devDependencies)

Get a [UTF-16](https://wikipedia.org/wiki/UTF-16)-encoded code point number of a character

```javascript
'A'.charCodeAt(0); //=> 65
codePoint('A'); //=> 65

'嶲'.charCodeAt(0); //=> 55422
codePoint('嶲'); //=> 195060
```

## Installation

### Package managers

#### [npm](https://www.npmjs.com/)

```
npm install code-point
```

#### [Bower](http://bower.io/)

```
bower install code-point
```

### Standalone

[Download the script file directly.](https://raw.githubusercontent.com/shinnn/code-point.js/master/browser.js)

## API

### codePoint(*character*)

*character*: `String`  
Return: `Number`

If it takes a string as an argument, it returns the same result of `character.codePointAt(0)`.

It throws an error if the argument is not a string or the string is empty.

```javascript
codePoint('\udada'); //=> 56026
codePoint('\udada\udfdf'); //=> 814047
```

It works correctly even in ECMAScript <= 5 environments that don't support  [`String.prototype.codePointAt`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt).

## Credit

This module includes the code of [mathiasbynens](https://github.com/mathiasbynens) / [String.prototype.codePointAt](https://github.com/mathiasbynens/String.prototype.codePointAt). Thanks, [Mathias Bynens][mathias].

## Licenses

### [String.prototype.codePointAt](https://github.com/mathiasbynens/String.prototype.codePointAt#license)

Author: [Mathias Bynens][mathias]

> This polyfill is available under the [MIT](https://opensource.org/licenses/mit-license) license.

### code-point.js

Copyright (c) 2014 - 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](https://github.com/shinnn/code-point/blob/master/LICENSES.md#code-pointjs).

[mathias]: https://mathiasbynens.be/
