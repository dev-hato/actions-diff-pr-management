# @textlint-rule/textlint-rule-no-unmatched-pair [![Actions Status: test](https://github.com/textlint-rule/textlint-rule-no-unmatched-pair/workflows/test/badge.svg)](https://github.com/textlint-rule/textlint-rule-no-unmatched-pair/actions?query=workflow%3A"test")

textlint rule that check unmatched pairs like `（` and `]`

## Support pair characters

- double quote: `"` and `"`
- angled bracket[]: `[` and `]`
- round bracket(): `(` and `)`
- curly brace{}: `{` and `}`
- かぎ括弧「」: `「` and `」`
- 丸括弧（）: `（` and `）`
- 二重かぎ括弧『』: `『` and `』`
- 波括弧｛｝: `｛` and `｝`
- 角括弧［］: `［` and `］`
- 重角括弧〚〛: `〚` and `〛`
- 隅付き括弧【】: `【` and `】`

## Examples

**OK**:

```
これは(秘密)です。
John said "Hello World!".
```

**NG**:

```
これは（秘密)です。
John said "Hello World!'.
```


## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-rule/textlint-rule-no-unmatched-pair

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-rule/no-unmatched-pair": true
    }
}
```

Via CLI

```
textlint --rule @textlint-rule/no-unmatched-pair README.md
```


## Changelog

See [Releases page](https://github.com/textlint-rule/textlint-rule-no-unmatched-pair/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-rule/textlint-rule-no-unmatched-pair/issues).

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
