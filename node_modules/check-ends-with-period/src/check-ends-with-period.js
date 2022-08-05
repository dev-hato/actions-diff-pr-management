// MIT © 2017 azu
"use strict";
const find = require("array.prototype.find");
const endWith = require("end-with");
const emojiRegExp = require("emoji-regex")();
const exceptionMarkRegExp = /[!?！？\)）」』]/;

/**
 * Check ends with period.
 * @param {string} lineText
 * @param {string[]} periodMarks
 * @param {boolean} allowExceptionMark often used at end.
 * @param {boolean} allowEmoji
 * @returns {{valid: boolean, periodMark: string, index: number}}
 *
 * `index` is index value of last character.
 * If last character is a parts of periodMarks, `index` is the position of periodMark.
 * If last character is not a parts of periodMarks, `index` is the position of the last character.
 * If last character is white space, `index` is the position of starting of white space on the end.
 */
const checkEndsWithPeriod = function(lineText, {
    periodMarks = ["。", "."],
    allowExceptionMark = true,
    allowEmoji = false,
} = {}) {
    // サロゲートペアを考慮した文字列長・文字アクセス
    const characters = [...lineText];
    const lastCharacterIndex = characters.length - 1;
    const periodMark = characters[lastCharacterIndex];
    if (/\s/.test(periodMark)) {
        const [whiteSpaces] = lineText.match(/\s+$/);
        return {
            valid: false,
            periodMark: whiteSpaces,
            index: lastCharacterIndex - (whiteSpaces.length - 1)
        };
    }
    // allo exclamation mark and serif symbol
    if (allowExceptionMark && exceptionMarkRegExp.test(periodMark)) {
        return {
            valid: true,
            periodMark,
            index: lastCharacterIndex
        };
    }
    // allow emoji
    if (allowEmoji && emojiRegExp.test(periodMark)) {
        return {
            valid: true,
            periodMark,
            index: lastCharacterIndex
        };
    }
    /**
     * @type {string|undefined}
     */
    const matchMark = find(periodMarks, (mark) => {
        return endWith(lineText, mark);
    });
    if (matchMark) {
        return {
            valid: true,
            periodMark: matchMark,
            index: lineText.length - matchMark.length
        };
    }
    return {
        valid: false,
        periodMark,
        index: lastCharacterIndex
    };
};
module.exports = checkEndsWithPeriod;