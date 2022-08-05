// LICENSE : MIT
"use strict";
const flagsGetter = require("regexp.prototype.flags");
const assert = require("assert");

/**
 * @typedef {Object} MatchCaptureGroup
 * @property {string} text - text is matched texts
 * @property {number} index - index is start of match
 */
export type MatchCaptureGroup = {
    text: string;
    index: number;
}
export type MatchAllGroup = {
    all: string[];
    input: string;
    index: number;
    captureGroups: MatchCaptureGroup[]
}

/**
 * @param {string} text
 * @param {RegExp} regExp regExp should include capture
 * @returns {MatchCaptureGroup[]} return array of MatchCaptureGroup
 */
export function matchCaptureGroupAll(text: string, regExp: RegExp): MatchCaptureGroup[] {
    const source = regExp.source;
    assert(source.indexOf("(") >= 0, "RegExp should contains capture group at least one");
    const all = matchAll(text, regExp);
    const captureGroups: MatchCaptureGroup[] = [];
    all.forEach(match => {
        match.captureGroups.forEach(captureGroup => {
            captureGroups.push(captureGroup);
        });
    });
    return captureGroups;
}

/**
 * matchAll function inspired String.prototype.matchAll
 * @param {String} text
 * @param {RegExp} regExp
 * @returns {MatchAllGroup[]}
 * @see reference https://github.com/tc39/String.prototype.matchAll
 * http://stackoverflow.com/questions/15934353/get-index-of-each-capture-in-a-javascript-regex
 */
export function matchAll(text: string, regExp: RegExp): MatchAllGroup[] {
    const matches: MatchAllGroup[] = [];
    let flags = regExp.flags || flagsGetter(regExp);
    if (flags.indexOf('g') === -1) {
        flags = 'g' + flags;
    }
    const rx = new RegExp(regExp.source, flags);
    text.replace(rx, function () {
        const matchAll = Array.prototype.slice.call(arguments, 0, -2);
        const match: MatchAllGroup = {
            all: matchAll,
            input: arguments[arguments.length - 1],
            index: arguments[arguments.length - 2],
            captureGroups: []
        };
        const groups = matchAll.slice(1);
        const captureGroups = [];
        for (let cursor = match.index, l = groups.length, i = 0; i < l; i++) {
            let index = cursor;

            if (i + 1 !== l && groups[i] !== groups[i + 1]) {
                const nextIndex = text.indexOf(groups[i + 1], cursor);
                while (true) {
                    const currentIndex = text.indexOf(groups[i], index);
                    if (currentIndex !== -1 && currentIndex <= nextIndex) {
                        index = currentIndex + 1;
                    } else {
                        break;
                    }
                }
                index--;
            } else {
                index = text.indexOf(groups[i], cursor);

            }
            cursor = index + (groups[i] ? groups[i].length : 0);
            const captureGroup = {
                text: groups[i],
                index
            };
            captureGroups.push(captureGroup);
        }
        match.captureGroups = captureGroups;
        matches.push(match);
        /*
            index,
            input,
            all,
            captureGroups = [{
                text,
                index
            }]
         */
        return "";
    });
    return matches;
}
