"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var kuromojin = require("kuromojin");
var createMatcher = require("morpheme-match-all");
var dictionaries = require("./dict");

var matchAll = createMatcher(dictionaries);

function reporter(context) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var Syntax = context.Syntax,
      RuleError = context.RuleError,
      report = context.report,
      getSource = context.getSource,
      fixer = context.fixer;

  return _defineProperty({}, Syntax.Str, function (node) {
    // "Str" node
    var text = getSource(node); // Get text

    return kuromojin.tokenize(text).then(function (actualTokens) {
      //console.log(actualTokens);
      var results = matchAll(actualTokens);

      if (results.length == 0) {
        return;
      }

      results.forEach(function (result) {

        var offset = result.dict.extensions.offset === undefined ? 0 : result.dict.extensions.offset;
        var index = Math.max(result.tokens[offset].word_position - 1, 0);

        var textToReplace = "";

        result.tokens.forEach(function (token, i) {
          if (i >= offset) {
            textToReplace += token.surface_form;
          }
        });

        var fix = fixer.replaceTextRange([index, index + textToReplace.length], result.dict.expected);
        var ruleError = new RuleError(result.dict.message, {
          index: index,
          fix: fix
        });
        report(node, ruleError);
      });
    });
  });
}

module.exports = {
  linter: reporter,
  fixer: reporter
};
//# sourceMappingURL=index.js.map