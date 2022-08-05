# textlint-rule-no-exclamation-question-mark [![Build Status](https://travis-ci.org/textlint-rule/textlint-rule-no-exclamation-question-mark.svg?branch=master)](https://travis-ci.org/textlint-rule/textlint-rule-no-exclamation-question-mark)

textlint rule that disallow exclamation and question mark.

## Install

Install with [npm](https://www.npmjs.com/):

    npm i textlint-rule-no-exclamation-question-mark

## Usage

Via `.textlintrc`.

```
{
    "rules": {
        "no-exclamation-question-mark": true
    }
}
```

### Options

Defaults: Disallows to use `!?！？`.

- `allow`: `string[]`,
    - allow word list that suppor [RegExp-like String](https://github.com/textlint/textlint-filter-rule-allowlist#regexp-like-string)
    - some unique noun is allowed by default
    - Default: `[]`
- `allowHalfWidthExclamation`: `boolean`
    - allow to use !
    - Default: `false`
- `allowFullWidthExclamation`: `boolean`
    - allow to use ！
    - Default: `false`
- `allowHalfWidthQuestion`: `boolean`
    - allow to use ?
    - Default: `false`
- `allowFullWidthQuestion`: `boolean`
    - allow to use ？
    - Default: `false`

```
{
    "rules": {
        "no-exclamation-question-mark": {
            // allow words
            "allow": [
                "Yahoo!"
            ],
            // allow to use !
            "allowHalfWidthExclamation": false,
            // allow to use ！
            "allowFullWidthExclamation": false,
            // allow to use ?
            "allowHalfWidthQuestion": false,
            // allow to use ？
            "allowFullWidthQuestion": false
        }
    }
}
```


## Changelog

See [Releases page](https://github.com/textlint-rule/textlint-rule-no-exclamation-question-mark/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.
For bugs and feature requests, [please create an issue](https://github.com/textlint-rule/textlint-rule-no-exclamation-question-mark/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](http://twitter.com/azu_re)

## License

MIT © azu
