# textlint-rule-footnote-order [![Build Status](https://travis-ci.org/textlint-rule/textlint-rule-footnote-order.svg?branch=master)](https://travis-ci.org/textlint-rule/textlint-rule-footnote-order)

textlint rule that sort footnote identifier(`[^1]`) order.

This rule check that to use incremental number for footnote identifier.

- **Limitation:** This rule work only Markdown.

**OK**:

```
foo [^1]
bar [^2]


[^1]: foo is ...
[^2]: bar is ...
```

**NG**:

```
foo [^foo]
bar [^bar]


[^foo]: foo is ...
[^bar]: bar is ...
```


## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-footnote-order

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "footnote-order": true
    }
}
```

Via CLI

```
textlint --rule footnote-order README.md
```

## Options

- `startIndex`: `number`
    - Default: `1`
    - Start number of footnode identifier
    - Example) `^1`, `^2`. `^3` ...


```json
{
    "rules": {
        "footnote-order": {
            "startIndex": 1
        }
    }
}
```

## Changelog

See [Releases page](https://github.com/textlint-rule/textlint-rule-footnote-order/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-rule/textlint-rule-footnote-order/issues).

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
