# textlint-rule-max-comma [![Actions Status: test](https://github.com/azu/textlint-rule-max-comma/workflows/test/badge.svg)](https://github.com/azu/textlint-rule-max-comma/actions?query=workflow%3A"test")

[textlint](http://textlint.github.io/ "textlint") rule is that limit maximum comma(,) count of sentence.

## Installation

    npm install textlint-rule-max-comma

## Usage

    $ npm install -D textlint textlint-rule-max-comma
    $ $(npm bin)/textlint --rule max-comma README.md
    #    11:0  error  This sentence exceeds the maximum count of comma. Maximum is 4.

## Options

- `max`: maximum number of ","
  - Default: `4`
  - It means that report an error if the sentence include 5 or more `,` 

Configure `"max"` value of the `.textlintrc` file.

```json
{
  "rules": {
    "max-comma": {
        "max" : 4
    }
  }
}
```

## Tests

    npm test

## Related

- [textlint-rule-max-ten](https://github.com/textlint-ja/textlint-rule-max-ten)
  - Japanese comma(`、`) edition

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
