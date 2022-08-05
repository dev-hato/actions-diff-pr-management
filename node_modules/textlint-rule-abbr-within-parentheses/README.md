# textlint-rule-abbr-within-parentheses [![Build Status](https://travis-ci.org/azu/textlint-rule-abbr-within-parentheses.svg?branch=master)](https://travis-ci.org/azu/textlint-rule-abbr-within-parentheses) [![textlint fixable rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/) 

textlint rule check that abbreviations within parentheses.

Write parentheses within parentheses.

> Ths Object Management Group(OMG) maintains specifications for the Unified Modeling Language(UML).

## Examples
**OK**:

```
This is Open Source Software(OSS)
これはOpen Source Software（OSS）なルールです
JavaScript(JS)
```

**NG**:

```
LTS（Long-Term Support）
JS(JavaScript)
This rule is OSS(Open Source Software)
これはOSS（Open Source Software）なルールです
```


## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-abbr-within-parentheses

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "abbr-within-parentheses": true
    }
}
```

Via CLI

```
textlint --rule abbr-within-parentheses README.md
```

## Reference

### English

- [Which would you place in parentheses: the expansion or the abbreviation? - English Language & Usage Stack Exchange](https://english.stackexchange.com/questions/84958/which-would-you-place-in-parentheses-the-expansion-or-the-abbreviation "Which would you place in parentheses: the expansion or the abbreviation? - English Language &amp; Usage Stack Exchange")
- [APA Style Blog: An Abbreviations FAQ](http://blog.apastyle.org/apastyle/2015/10/an-abbreviations-faq.html)
- [Q&A: Why you shouldn't put acronyms in parentheses](http://www.kuediting.com/style/qa-why-you-shouldnt-put-acronyms-in-parentheses/ "Q&amp;A: Why you shouldn&#39;t put acronyms in parentheses")
- [The IBM Style Guide: Conventions for Writers and Editors - Francis DeRespinis, Peter Hayward, Jana Jenkins, Amy Laird, Leslie McDonald, Eric Radzinski - Google ブックス](https://books.google.co.jp/books?id=77WoO_P8yA4C&pg=PA57&lpg=PA57 "The IBM Style Guide: Conventions for Writers and Editors - Francis DeRespinis, Peter Hayward, Jana Jenkins, Amy Laird, Leslie McDonald, Eric Radzinski")

### Japanese

最初に正式名称を書き、繰り返す書くので次から略すという意味合いで、略称を括弧内に書きます。

- [Microsoft Word - 執筆ガイドライン20151109訂正.docx - denshi-m2.pdf](http://www.jsphcs.jp/gakkaishi/denshi-m2.pdf "Microsoft Word - 執筆ガイドライン20151109訂正.docx - denshi-m2.pdf")
- [Logical Skill の深い話 略語の表記](http://logicalskill.blog.fc2.com/blog-entry-79.html)
- [略語 : abbreviation と acronym - 職業プログラマの休日出勤](http://tmotooka.hatenablog.jp/entry/2013/05/18/212538)


## Changelog

See [Releases page](https://github.com/azu/textlint-rule-abbr-within-parentheses/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/textlint-rule-abbr-within-parentheses/issues).

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
