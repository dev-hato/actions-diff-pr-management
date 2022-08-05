# sorted-joyo-kanji [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Sorted array of [joyo-kanji](https://github.com/jamesknelson/node-joyo-kanji)

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install sorted-joyo-kanji
```

## Usage

```javascript
var assert = require('power-assert')
var joyoKanji = require('sorted-joyo-kanji')
var each = require('amp-each')
var codePoint = require('code-point')

describe('JoyoKanjiTest', () => {
  it('array length check', () => {
    var kanji = joyoKanji.kanji
    var codepoint = joyoKanji.codepoint

    assert(kanji.length === 2136)
    assert(codepoint.length === 2136)
  })

  it('array sort check', () => {
    var codepoint = joyoKanji.codepoint

    each(codepoint, (item, index) => {
      if (index < codepoint.length - 1) {
        assert(codepoint[index] < codepoint[index + 1])
      }
    })
  })

  it('isJoyo', () => {
    assert(joyoKanji.isJoyo('聡') === false)
    assert(joyoKanji.isJoyo('明') === true)
    assert(joyoKanji.isJoyo('推') === true)
    assert(joyoKanji.isJoyo('敲') === false)
  })
})
```

## API

### sorted-joyo-kanji.kanji

*   `kanji` — Sorted array of the Joyo Kanji. `["一","丁","七","万","丈","三","上","下","不","与","且","世", ...]`

### sorted-joyo-kanji.codepoint

*   `codepoint` — Sorted array of UTF-16-encoded code point number. `[19968,19969,19971,19975,19976,19977,19978,19979,19981, ...]`

### sorted-joyo-kanji.isJoyo(value)

*   Joyo Kanji check using sorted codepoint array and binary search.

**Parameters**

*   `value` — a kanji character.

## Related

*   [joyo-kanji](https://github.com/jamesknelson/node-joyo-kanji)
*   [code-point](https://github.com/shinnn/code-point.js)

## License

[MIT](LICENSE)
