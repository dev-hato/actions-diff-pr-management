// MIT © 2017 azu
"use strict";
const { expandWordsToAcronym } = require("./word-utils");

const matchCaptureGroupAll = require("match-index").matchCaptureGroupAll;

/**
 * Match
 *
 * ABC(any string)
 * ---|------------
 * $1$2   $3     $4
 * @type {RegExp}
 */
const AbbreviationsWithoutPattern = /([A-Z]+)([（(])(.*?)([）)])/g;
const reporter = function(context) {
    const { Syntax, RuleError, report, getSource, fixer } = context;
    return {
        [Syntax.Str](node) {
            const text = getSource(node);
            const captureGroups = matchCaptureGroupAll(text, AbbreviationsWithoutPattern);
            if (captureGroups.length !== 4) {
                return;
            }
            const [abbr, startPair, word, endPair] = captureGroups;
            const actualAbbr = expandWordsToAcronym(word.text.split(/\s-/));
            if (abbr.text === actualAbbr) {
                const fixed = fixer.replaceTextRange([
                    abbr.index,
                    endPair.index + endPair.text.length
                ], `${word.text}${startPair.text}${abbr.text}${endPair.text}`);
                report(node, new RuleError("Abbreviation should be within parentheses.", {
                    index: abbr.index,
                    fix: fixed
                }))
            }
        }
    }
};

module.exports = {
    linter: reporter,
    fixer: reporter
};