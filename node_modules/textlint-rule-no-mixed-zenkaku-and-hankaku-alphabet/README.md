# textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet [![Build Status](https://travis-ci.org/textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet.svg?branch=master)](https://travis-ci.org/textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet)

全角と半角アルファベットを混在をチェックするtextlintルール

設定で全角または半角アルファベットどちらを利用するかを変更できます。
デフォルトでは半角アルファベットを利用するようにチェックします。

**OK**:

```
ABCは半角
```

**NG**:


```
ＡＢＣは全角
```


## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "no-mixed-zenkaku-and-hankaku-alphabet": true
    }
}
```

Via CLI

```
textlint --rule no-mixed-zenkaku-and-hankaku-alphabet README.md
```

## Options

- `prefer`: `"全角"` または `"半角"` を指定します
  - デフォルトは `"半角"` です

### Example

`.textlintrc`:

```json
{
    "rules": {
        "no-mixed-zenkaku-and-hankaku-alphabet": {
          "prefer": "全角"
        }
    }
}
```

OK:

```
ＡＢＣは全角
```

NG:

```
ABCは半角
```

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet/issues).

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
