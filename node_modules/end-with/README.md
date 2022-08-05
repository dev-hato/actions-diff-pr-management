# end-with <sup>[![Version Badge](http://versionbadg.es/gearcase/end-with.svg)](https://npmjs.org/package/end-with)</sup>


> Determines whether a string ends with the characters of another string.

> ES2015 [String#endsWith()](http://www.ecma-international.org/ecma-262/6.0/#sec-string.prototype.endswith) ponyfill.

> Ponyfill: A polyfill that doesn't overwrite the native method.


[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/gearcase/end-with/blob/master/LICENSE)

[![build:?](https://img.shields.io/travis/gearcase/end-with/master.svg?style=flat-square)](https://travis-ci.org/gearcase/end-with)
[![coverage:?](https://img.shields.io/coveralls/gearcase/end-with/master.svg?style=flat-square)](https://coveralls.io/github/gearcase/end-with)


## Install

```
$ npm install --save end-with 
```

## Usage

> For more use-cases see the [tests](https://github.com/gearcase/end-with/blob/master/test/spec/index.js)

```js
var endWith = require('end-with');

endWith('abcde', 'e');  // => true
endWith('abcde', 'de'); // => true
endWith('abcde', 'bc'); // => false
endWith('abcde', '');   // => true
endWith('abcde');       // => false
endWith('abcde', null); // => false

```

## Related

- [start-with](https://github.com/gearcase/start-with) - Determines whether a string begins with the characters of another string.
- [pad-start](https://github.com/gearcase/pad-start) - ES spec-compliant String.prototype.padStart shim.
- [pad-end](https://github.com/gearcase/pad-end) - ES spec-compliant String.prototype.padEnd shim.

## Contributing
 
Pull requests and stars are highly welcome. 

For bugs and feature requests, please [create an issue](https://github.com/gearcase/end-with/issues). 
