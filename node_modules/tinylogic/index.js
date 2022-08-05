const makeLanguage = require(`./language`);

exports.makeParser = (queryPattern = /[a-z]+/) => {
  const {
    TinylogicLexer,
    TinylogicParser,
  } = makeLanguage(queryPattern);

  const parser = new TinylogicParser();

  return (str, checkFn) => {
    const lexingResult = TinylogicLexer.tokenize(str);
    parser.input = lexingResult.tokens;
    return parser.expression()(checkFn);
  };
};

exports.parse = exports.makeParser();
