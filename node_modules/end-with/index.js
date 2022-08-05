'use strict';

module.exports = function (str, suffix) {

  if (typeof suffix === 'undefined' || suffix === null) {
    return false;
  }

  str    = String(str);
  suffix = String(suffix);

  var i = suffix.length;
  var l = str.length - i;

  while (i--) {
    if (suffix.charAt(i) !== str.charAt(l + i)) {
      return false;
    }
  }
  return true;
};
