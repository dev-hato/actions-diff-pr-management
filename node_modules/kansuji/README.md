# kansuji

[![Build Status](https://travis-ci.org/io-monad/kansuji.svg?branch=master)](https://travis-ci.org/io-monad/kansuji)

Node module to convert numbers into Japanese Kansuji string (number in Chinese characters).

## Install

    npm install kansuji

## Usage

### kansuji(n, options = {})

Convert a number into Japanese Kansuji string.

`n` can be a Number or a String in Arabic numerals.

#### Options

| Key     | Description | Default |
| ------- | ----------- | ------- |
| `unit`  | If set to `false`, don't use units and just convert each digit | true  |
| `ichi`  | If set to `true`, don't omit `一` (ichi) before `千`, `百`, `十`<br>If set to Array, don't omit `一` before each member like `1000` of the array | false |
| `daiji` | If set to `true`, use Daiji numbers like `壱弐参`, `拾`<br>If set to `"old"`, use old-style Daiji numbers like `零壱弐参肆伍陸漆捌玖`, `拾佰阡萬` | false |
| `wide`  | If set to `true`, allow wide-character numbers like `１２３` for input | false |

## Example

```js
var kansuji = require("kansuji");

console.log(kansuji(123));
// => "百二十三"

console.log(kansuji(12345));
// => "一万二千三百四十五"

console.log(kansuji(12345, { unit: false }));
// => "一二三四五"

console.log(kansuji(1001, { unit: false }));
// => "一〇〇一"

console.log(kansuji(11111));
// => "一万千百十一"

console.log(kansuji(11111, { ichi: true }));
// => "一万一千一百一十一"

console.log(kansuji(11111, { ichi: [1000, 100] }));
// => "一万一千一百十一"

console.log(kansuji(12.34));
// => "十二・三四"

console.log(kansuji("123"));
// => "百二十三"

console.log(kansuji("0123"));
// => "百二十三"

console.log(kansuji("123ABC"));
// => "百二十三"

console.log(kansuji("0123", { unit: false }));
// => "〇一二三"

console.log(kansuji("123.456"));
// => "百二十三・四五六"

console.log(kansuji("ABC"));
// => TypeError("Non-number string can't be converted")

console.log(kansuji(123, { daiji: true }));
// => "百弐拾参"

console.log(kansuji(1234567890, { daiji: true }));
// => "拾弐億参千四百五拾六万七千八百九拾"

console.log(kansuji(123, { daiji: true, unit: false }));
// => "壱弐参"

console.log(kansuji(1234567890, { daiji: "old" }));
// => "拾弐億参阡肆佰伍拾陸萬漆阡捌佰玖拾"

console.log(kansuji("１２３"));
// => TypeError("Non-number string can't be converted")

console.log(kansuji("１２３", { wide: true }));
// => "百二十三"

console.log(kansuji(Infinity));
// => TypeError("Infinity can't be converted")

console.log(kansuji(NaN));
// => TypeError("NaN can't be converted")
```

## Testing

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT (See LICENSE)
