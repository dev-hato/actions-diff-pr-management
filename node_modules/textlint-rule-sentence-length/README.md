# textlint-rule-sentence-length [![Actions Status: test](https://github.com/textlint-rule/textlint-rule-sentence-length/workflows/test/badge.svg)](https://github.com/textlint-rule/textlint-rule-sentence-length/actions?query=workflow%3A"test")

[textlint](https://github.com/textlint/textlint "textlint") rule that limit Maximum Length of Sentence.

## Installation

    npm install textlint-rule-sentence-length

## Usage

Add "sentence-length" to your `.textlintrc`.

```
{
    "rules": {
        "sentence-length": true
    }
}
```


### Options

- `max`
    - default: 100
    - The total number of characters allowed on each sentences.
    - Sentence.length > 100 and throw Error
- `skipPatterns`: `string[]`
    - A strings that match the patterns is uncount of the sentence.
    - Set an array of RegExp-like string.
    - See https://github.com/textlint/regexp-string-matcher
- `skipUrlStringLink`: `boolean`
    - Default: `true`
    - If it is `true`, skip url string link node like `<https:example.com>` or `[https://example.com](https://example.com)`
    - url string link is has the text which is same of url.

```
{
    "rules": {
        "sentence-length": {
            "max": 100
        }
    }
}
```

Uncount `(...)` from `A sentence(...).`

```
{
    "rules": {
        "sentence-length": {
            "max": 100,
            "skipPatterns": [
                "/\\(.*\\)$\\./"
            ]

        }
    }
}
```

## Exception

- Except BlockQuote
- Except a single link node
- Except url string link (`skipUrlStringLink`)

**OK**:

```
> LONG LONG LONG LONG LONG LONG LONG LONG Quote text. But it is quote text.

a single link node ↓

[textlint/textlint-filter-rule-comments: textlint filter rule that disables all rules between comments directive.](https://github.com/textlint/textlint-filter-rule-comments)

Very long https://example.com?longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong url.

```

**NG**:

This sentence includes one link and two Str.

```
This is [textlint/textlint-filter-rule-comments: textlint filter rule that disables all rules between comments directive.](https://github.com/textlint/textlint-filter-rule-comments).
```


## Related Rules

See [Other rules](https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule)

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
