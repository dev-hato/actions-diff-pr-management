# textlint-rule-ja-no-successive-word [![Actions Status: test](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/workflows/test/badge.svg)](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/actions?query=workflow%3A"test")

同一の単語（厳密には形態素解析した結果のToken）が間違えて連続しているのを見つけるtextlintルール。
入力ミスによる同じ単語が連続している問題を発見します。


**OK**:

```
これは問題ない文章です。
すもももももももものうち
111回目の問題
フレームレートが落ちて動作がカクカクしてきた
```

**NG**:

```
これはは問題ある文章です。
これは問題あるある文章です
```

- **は**が連続している
- **ある**が連続している

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-ja-no-successive-word

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "ja-no-successive-word": true
    }
}
```

Via CLI

```
textlint --rule ja-no-successive-word README.md
```

## Options

オプションのデフォルト値

```json5
{
    "rules": {
        "ja-no-successive-word": {
            // オノマトペを許可する
            // 制限: オノマトペを判定する方法がないため、同じカタカナの語が連続したものをオノマトペとして扱う
            // 例) カクカク、ドキドキ、ビリビリ
            // https://ja.wikipedia.org/wiki/%E6%93%AC%E5%A3%B0%E8%AA%9E
            allowOnomatopee: true,
            
            // 許可する単語
            // RegExp-like Stringを使用可能
            allow: []
        }
    }
}
```

- `allowOnomatopee: boolean` 
    - Default: `true`
    - **カクカク**などの[オノマトペ](https://ja.wikipedia.org/wiki/%E6%93%AC%E5%A3%B0%E8%AA%9E)を許可するかのオプションです。
- `allow`: `string[]`
    - Default: `[]`
    - 許可する単語を指定するオプションです。
    - [RegExp-like String](https://github.com/textlint/textlint-filter-rule-allowlist#regexp-like-string)を使用できます。

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## 参考

- [RedPen 1.6 ドキュメント](http://redpen.cc/docs/latest/index_ja.html#successiveword)
- [redpen/SuccessiveWordValidator.java at master · redpen-cc/redpen](https://github.com/redpen-cc/redpen/blob/master/redpen-core/src/main/java/cc/redpen/validator/sentence/SuccessiveWordValidator.java#L29)


## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/issues).

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
