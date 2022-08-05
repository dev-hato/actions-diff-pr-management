# textlint-rule-no-doubled-conjunction

This module is a textlint plugin to check duplicated same conjunctions.

同じ接続詞が連続して出現していないかどうかをチェックするための[textlint](https://github.com/textlint/textlint "textlint")ルールです。

ex)

> かな漢字変換により漢字が多用される傾向がある。しかし漢字の多用が読みにくさをもたらす側面は否定できない。しかし、平仮名が多い文は間延びした印象を与える恐れもある。

In this example, "**しかし**" are used sequentially.

## Installation

    npm install textlint-rule-no-doubled-conjunction

### Require

- textlint 5.0 >=

### Dependencies

- [azu/kuromojin](https://github.com/azu/kuromojin): a wrapper of [kuromoji.js](https://github.com/takuyaa/kuromoji.js "kuromoji.js")
- [azu/sentence-splitter](https://github.com/azu/sentence-splitter)

## Usage

    textlint --rule no-doubled-conjunction sample.md

### Options

There's no options for this plugin.

## Tests

    npm test

## Reference

- [textlint](https://github.com/textlint/textlint)
- [textlint-rule-no-doubled-joshi](https://github.com/azu/textlint-rule-no-doubled-joshi): this plugin is based on it
- [textlint-rule-no-start-duplicated-conjunction](https://github.com/azu/textlint-rule-no-start-duplicated-conjunction): similar plugin, but it doesn't use part-of-speech but spliting with pointing(comma).

## License

MIT
