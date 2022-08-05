"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npm2rezplus = exports.pep4402rezInclusiveBound = exports.rez2pep440 = exports.rez2npm = exports.padZeroes = void 0;
const regex_1 = require("../../../util/regex");
const pattern_1 = require("./pattern");
function getVersionParts(input) {
    const versionParts = input.split('-');
    if (versionParts.length === 1) {
        return [input, ''];
    }
    return [versionParts[0], '-' + versionParts[1]];
}
function padZeroes(input) {
    if ((0, regex_1.regEx)(/[~^*]/).test(input)) {
        // ignore ranges
        return input;
    }
    const [output, stability] = getVersionParts(input);
    const sections = output.split('.');
    while (sections.length < 3) {
        sections.push('0');
    }
    return sections.join('.') + stability;
}
exports.padZeroes = padZeroes;
function plus2npm(input) {
    if (input.includes('+')) {
        return '>=' + input.replace('+', ' ');
    }
    return input;
}
function rez2npm(input) {
    if (pattern_1.matchVersion.test(input)) {
        return input;
    }
    if (pattern_1.exactVersion.test(input)) {
        return input.replace('==', '=');
    }
    if (pattern_1.inclusiveBound.test(input)) {
        return '>=' + input.replace((0, regex_1.regEx)(/\.\./g), ' <');
    }
    if (pattern_1.lowerBound.test(input)) {
        return plus2npm(input);
    }
    if (pattern_1.upperBound.test(input)) {
        return input;
    }
    const matchAscRange = pattern_1.ascendingRange.exec(input);
    if (matchAscRange?.groups) {
        const lowerBoundAsc = matchAscRange.groups.range_lower_asc;
        const upperBoundAsc = matchAscRange.groups.range_upper_asc;
        return plus2npm(lowerBoundAsc) + ' ' + plus2npm(upperBoundAsc);
    }
    const matchDscRange = pattern_1.descendingRange.exec(input);
    if (matchDscRange?.groups) {
        const upperBoundDesc = matchDscRange.groups.range_upper_desc;
        const lowerBoundDesc = matchDscRange.groups.range_lower_desc;
        return plus2npm(lowerBoundDesc) + ' ' + plus2npm(upperBoundDesc);
    }
    return input;
}
exports.rez2npm = rez2npm;
function rez2pep440(input) {
    if (pattern_1.matchVersion.test(input)) {
        return input;
    }
    if (pattern_1.exactVersion.test(input)) {
        return input;
    }
    if (pattern_1.inclusiveBound.test(input)) {
        return '>=' + input.replace((0, regex_1.regEx)(/\.\./g), ', <');
    }
    if (pattern_1.lowerBound.test(input)) {
        return plus2npm(input);
    }
    if (pattern_1.upperBound.test(input)) {
        return input;
    }
    const matchAscRange = pattern_1.ascendingRange.exec(input);
    if (matchAscRange?.groups) {
        const lowerBoundAsc = matchAscRange.groups.range_lower_asc;
        const upperBoundAsc = matchAscRange.groups.range_upper_asc;
        return plus2npm(lowerBoundAsc) + ', ' + plus2npm(upperBoundAsc);
    }
    const matchDscRange = pattern_1.descendingRange.exec(input);
    if (matchDscRange?.groups) {
        const upperBoundDesc = matchDscRange.groups.range_upper_desc;
        const lowerBoundDesc = matchDscRange.groups.range_lower_desc;
        return plus2npm(lowerBoundDesc) + ', ' + plus2npm(upperBoundDesc);
    }
    return input;
}
exports.rez2pep440 = rez2pep440;
function pep4402rezInclusiveBound(input) {
    return input
        .split(',')
        .map((v) => v.trim().replace((0, regex_1.regEx)(/[<>=]/g), ''))
        .join('..');
}
exports.pep4402rezInclusiveBound = pep4402rezInclusiveBound;
function npm2rezplus(input) {
    return input.trim().replace('>=', '') + '+';
}
exports.npm2rezplus = npm2rezplus;
//# sourceMappingURL=transform.js.map