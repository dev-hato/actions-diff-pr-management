# textlint-rule-no-insert-dropping-sa [![Actions Status: test](https://github.com/textlint-ja/textlint-rule-no-insert-dropping-sa/workflows/test/badge.svg)](https://github.com/textlint-ja/textlint-rule-no-insert-dropping-sa/actions?query=workflow%3A"test")

サ抜き、サ入れ表現の誤用をチェックするtextlintルール

「さ」を余計にいれている、逆に「さ」が抜けている文をチェックする[textlint](https://github.com/textlint/textlint "textlint")ルールです。

![img](https://monosnap.com/file/UBfxUYEvlo3vACBM9qTzZ9wyh4XxTO.png)

[新規サ抜き・サ入れ表現から見る誤用と正用の分析 - 寺﨑知之](http://www.anlp.jp/proceedings/annual_meeting/2012/pdf_dir/B1-2.pdf)より引用。

時代によって「さ」の有無が変化する単語もあるため、このルールはある種の感覚的な類推が含まれています。

**OK**:

```
今年はたいそう良いことがあった。
言わさせていただきます
今日は暖かさそう。
色々考えましたが一番いいのは食べなさそうな観葉植物にする
一生お金に困らなさそうな人ってどんなイメージの人ですか
大尉はいかにもすまなさそうに言った
大尉はいかにもすまなそうに言った
```

**NG**:

```
早く終わらせて帰りたさそうなのがおかしかった。
薫と巽さんがチョコを食べたさそうにしてたから、仕方なくほんの少しだけ分けてあげたから
刺し身をたべたさそう。
寿司が美味しさそう。
辛さそうな様子だ。
これは問題無そう。
芸術性なんてとても関係無そう。
これは良そう
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-ja/textlint-rule-no-insert-dropping-sa

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/textlint-rule-no-insert-dropping-sa": true
    }
}
```

Via CLI

```
textlint --rule @textlint-ja/textlint-rule-no-insert-dropping-sa README.md
```

## 元ネタ

- [新規サ抜き・サ入れ表現から見る誤用と正用の分析 - 寺﨑知之](http://www.anlp.jp/proceedings/annual_meeting/2012/pdf_dir/B1-2.pdf)

を元にしたtextlintルールです。

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-no-insert-dropping-sa/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-no-insert-dropping-sa/issues).

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
