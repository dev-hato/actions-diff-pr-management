/*!
 * String.prototype.codePointAt v0.2.0 | MIT (c) Mathias Bynens (@mathias)
 * http://mths.be/codepointat
 *
 * code-point | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/code-point.js
*/
'use strict';

var getCodePoint = typeof String.prototype.codePointAt === 'function' ? function getCodePoint(str) {
  return str.codePointAt(0);
} : function getCodePoint(str) {
  var first = str.charCodeAt(0);

  if (first >= 0xD800 && first <= 0xDBFF && str.length > 1) {
    var second = str.charCodeAt(1);

    if (second >= 0xDC00 && second <= 0xDFFF) {
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }

  return first;
};

module.exports = function codePoint(str) {
  if (typeof str !== 'string') {
    throw new TypeError(String(str) + ' is not a string. Argument must be a string.');
  }

  if (str.length === 0) {
    throw new Error('Argument must be a non-empty string.');
  }

  return getCodePoint(str);
};
