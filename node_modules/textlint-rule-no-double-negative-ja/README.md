# textlint-rule-no-double-negative-ja [![Actions Status: test](https://github.com/textlint-ja/textlint-rule-no-double-negative-ja/workflows/test/badge.svg)](https://github.com/textlint-ja/textlint-rule-no-double-negative-ja/actions?query=workflow%3A"test")

[二重否定](https://ja.wikipedia.org/wiki/%E4%BA%8C%E9%87%8D%E5%90%A6%E5%AE%9A_(%E8%A8%80%E8%AA%9E%E5%AD%A6) "二重否定")
を検出する[textlint](https://github.com/textlint/textlint "textlint")ルールです。

> ✘ それが事件の発端だったといえなくもない。

二重否定: 〜なくもない

> ✘ 確かにそういった懸念はない事はない。

二重否定: 〜ないことはない

などの二重否定を検出することができます。

二重否定の用法については、[<研究論文>二重否定表現「～なくは/もない」「～ないでも/はない」「～ないことは/もない」「～ないものでは/もない」の使い分けを巡って](https://repository.kulib.kyoto-u.ac.jp/dspace/bitstream/2433/187059/1/Ronko3_043.pdf)を参照してください。

## Installation

    npm install textlint-rule-no-double-negative-ja

## Usage

インストール後、`.textlintrc`以下を追加します。

```js
{
    "rules"
:
    {
        "no-double-negative-ja"
    :
        true
    }
}
```

## Tests

    npm test

## 参考文献

- [<研究論文>二重否定表現「～なくは/もない」「～ないでも/はない」「～ないことは/もない」「～ないものでは/もない」の使い分けを巡って](https://repository.kulib.kyoto-u.ac.jp/dspace/bitstream/2433/187059/1/Ronko3_043.pdf)
- http://www.asahi-net.or.jp/~wd2y-kkb/n.htm#%E4%BA%8C%E9%87%8D%E5%90%A6%E5%AE%9A
- https://github.com/redpen-cc/redpen/blob/master/redpen-core/src/main/resources/default-resources/double-negative/double-negative-expression-ja.dat

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
