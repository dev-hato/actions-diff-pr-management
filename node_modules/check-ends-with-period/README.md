# check-ends-with-period [![Build Status](https://travis-ci.org/azu/check-ends-with-period.svg?branch=master)](https://travis-ci.org/azu/check-ends-with-period)

Check the text is ends with period mark.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install check-ends-with-period

## Usage

```js
/**
 * Check ends with period.
 * @param {string} lineText
 * @param {string[]} periodMarks
 * @param {boolean} allowExceptionMark often used at end.
 * @param {boolean} allowEmoji
 * @returns {{valid: boolean, periodMark: string, index: number}}
 *
 * `index` is index value of last character.
 * If last character is a parts of periodMarks, `index` is the position of periodMark.
 * If last character is not a parts of periodMarks, `index` is the position of the last character.
 * If last character is white space, `index` is the position of starting of white space.
 */
const checkEndsWithPeriod = function(lineText, {
    periodMarks = ["。", "."],
    allowExceptionMark = true,
    allowEmoji = false,
} = {}) {
    
}
```

## Example

```js
const checkEndsWithPeriod = require("check-ends-with-period");
// valid: periodMark
checkEndsWithPeriod("text.", {
    periodMarks: ["."]
});
/**
{
    valid: true,
    periodMark: ".",
    index: 4
}
*/

// invalid: forget periodMark
checkEndsWithPeriod("text");
/**
{
    valid: false,
    periodMark: "t",
    index: 3
}
*/

// invalid: white space
checkEndsWithPeriod("text   ");
/*
{
    valid: false,
    periodMark: "   ",
    index: 4
}
*/

// valid: allow emoji option
checkEndsWithPeriod("text❌", {
    allowEmoji: true
});
/*
{
    valid: true,
    periodMark: "❌",
    index: 4
}
*/
```


## Changelog

See [Releases page](https://github.com/azu/check-ends-with-period/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/check-ends-with-period/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
