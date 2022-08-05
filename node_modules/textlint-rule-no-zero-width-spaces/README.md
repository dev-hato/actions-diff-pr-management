# textlint-rule-no-zero-width-spaces

textlint rule that disallow zero width spaces.

```
1:1  error  Zero width space is disallowed.  no-zero-width-spaces
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-no-zero-width-spaces

## Usage

Via `.textlintrc`(Recommended)

```json
{
  "rules": {
    "no-zero-width-spaces": true
  }
}
```

Via CLI

```
textlint --rule no-zero-width-spaces README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

    npm test

## License

MIT © Tomoyuki Hata
