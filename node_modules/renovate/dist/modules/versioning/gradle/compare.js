"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = exports.parseMavenBasedRange = exports.parsePrefixRange = exports.RangeBound = exports.isVersion = exports.parse = exports.compare = exports.qualifierRank = exports.QualifierRank = exports.tokenize = exports.TokenType = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const regex_1 = require("../../../util/regex");
// eslint-disable-next-line typescript-enum/no-enum
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 1] = "Number";
    TokenType[TokenType["String"] = 2] = "String";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
function iterateChars(str, cb) {
    let prev = null;
    let next = null;
    for (let i = 0; i < str.length; i += 1) {
        next = str.charAt(i);
        cb(prev, next);
        prev = next;
    }
    cb(prev, null);
}
function isSeparator(char) {
    return (0, regex_1.regEx)(/^[-._+]$/i).test(char);
}
function isDigit(char) {
    return (0, regex_1.regEx)(/^\d$/).test(char);
}
function isLetter(char) {
    return !isSeparator(char) && !isDigit(char);
}
function isTransition(prevChar, nextChar) {
    return ((isDigit(prevChar) && isLetter(nextChar)) ||
        (isLetter(prevChar) && isDigit(nextChar)));
}
function tokenize(versionStr) {
    let result = [];
    let currentVal = '';
    function yieldToken() {
        if (currentVal === '') {
            result = null;
        }
        if (result) {
            const val = currentVal;
            if ((0, regex_1.regEx)(/^\d+$/).test(val)) {
                result.push({
                    type: TokenType.Number,
                    val: parseInt(val, 10),
                });
            }
            else {
                result.push({
                    type: TokenType.String,
                    val,
                });
            }
        }
    }
    iterateChars(versionStr, (prevChar, nextChar) => {
        if (nextChar === null) {
            yieldToken();
        }
        else if (isSeparator(nextChar)) {
            yieldToken();
            currentVal = '';
        }
        else if (prevChar !== null && isTransition(prevChar, nextChar)) {
            yieldToken();
            currentVal = nextChar;
        }
        else {
            currentVal = currentVal.concat(nextChar);
        }
    });
    return result;
}
exports.tokenize = tokenize;
// eslint-disable-next-line typescript-enum/no-enum
var QualifierRank;
(function (QualifierRank) {
    QualifierRank[QualifierRank["Dev"] = -1] = "Dev";
    QualifierRank[QualifierRank["Default"] = 0] = "Default";
    QualifierRank[QualifierRank["RC"] = 1] = "RC";
    QualifierRank[QualifierRank["Snapshot"] = 2] = "Snapshot";
    QualifierRank[QualifierRank["Final"] = 3] = "Final";
    QualifierRank[QualifierRank["GA"] = 4] = "GA";
    QualifierRank[QualifierRank["Release"] = 5] = "Release";
    QualifierRank[QualifierRank["SP"] = 6] = "SP";
})(QualifierRank = exports.QualifierRank || (exports.QualifierRank = {}));
function qualifierRank(input) {
    const val = input.toLowerCase();
    if (val === 'dev') {
        return QualifierRank.Dev;
    }
    if (val === 'rc' || val === 'cr') {
        return QualifierRank.RC;
    }
    if (val === 'snapshot') {
        return QualifierRank.Snapshot;
    }
    if (val === 'ga') {
        return QualifierRank.GA;
    }
    if (val === 'final') {
        return QualifierRank.Final;
    }
    if (val === 'release' || val === 'latest' || val === 'sr') {
        return QualifierRank.Release;
    }
    if (val === 'sp') {
        return QualifierRank.SP;
    }
    return QualifierRank.Default;
}
exports.qualifierRank = qualifierRank;
function stringTokenCmp(left, right) {
    const leftRank = qualifierRank(left);
    const rightRank = qualifierRank(right);
    if (leftRank === 0 && rightRank === 0) {
        if (left < right) {
            return -1;
        }
        if (left > right) {
            return 1;
        }
    }
    else {
        if (leftRank < rightRank) {
            return -1;
        }
        if (leftRank > rightRank) {
            return 1;
        }
    }
    return 0;
}
function tokenCmp(left, right) {
    if (left === null) {
        if (right?.type === TokenType.String) {
            return 1;
        }
        return -1;
    }
    if (right === null) {
        if (left.type === TokenType.String) {
            return -1;
        }
        return 1;
    }
    if (left.type === TokenType.Number && right.type === TokenType.Number) {
        if (left.val < right.val) {
            return -1;
        }
        if (left.val > right.val) {
            return 1;
        }
    }
    else if (typeof left.val === 'string' && typeof right.val === 'string') {
        return stringTokenCmp(left.val, right.val);
    }
    else if (right.type === TokenType.Number) {
        return -1;
    }
    else if (left.type === TokenType.Number) {
        return 1;
    }
    return 0;
}
function compare(left, right) {
    const leftTokens = tokenize(left) ?? [];
    const rightTokens = tokenize(right) ?? [];
    const length = Math.max(leftTokens.length, rightTokens.length);
    for (let idx = 0; idx < length; idx += 1) {
        const leftToken = leftTokens[idx] || null;
        const rightToken = rightTokens[idx] || null;
        const cmpResult = tokenCmp(leftToken, rightToken);
        if (cmpResult !== 0) {
            return cmpResult;
        }
    }
    return 0;
}
exports.compare = compare;
function parse(input) {
    if (!input) {
        return null;
    }
    if (!(0, regex_1.regEx)(/^[-._+a-zA-Z0-9]+$/i).test(input)) {
        return null;
    }
    if ((0, regex_1.regEx)(/^latest\.?/i).test(input)) {
        return null;
    }
    const tokens = tokenize(input);
    // istanbul ignore if: should not happen
    if (!tokens?.length) {
        return null;
    }
    return tokens;
}
exports.parse = parse;
function isVersion(input) {
    return !!parse(input);
}
exports.isVersion = isVersion;
// eslint-disable-next-line typescript-enum/no-enum
var RangeBound;
(function (RangeBound) {
    RangeBound[RangeBound["Inclusive"] = 1] = "Inclusive";
    RangeBound[RangeBound["Exclusive"] = 2] = "Exclusive";
})(RangeBound = exports.RangeBound || (exports.RangeBound = {}));
function parsePrefixRange(input) {
    if (!input) {
        return null;
    }
    if (input.trim() === '+') {
        return { tokens: [] };
    }
    const postfixRegex = (0, regex_1.regEx)(/[-._]\+$/);
    if (postfixRegex.test(input)) {
        const prefixValue = input.replace((0, regex_1.regEx)(/[-._]\+$/), '');
        const tokens = tokenize(prefixValue);
        return tokens ? { tokens } : null;
    }
    return null;
}
exports.parsePrefixRange = parsePrefixRange;
const mavenBasedRangeRegex = (0, regex_1.regEx)(/^(?<leftBoundStr>[[\](]\s*)(?<leftVal>[-._+a-zA-Z0-9]*?)(?<separator>\s*,\s*)(?<rightVal>[-._+a-zA-Z0-9]*?)(?<rightBoundStr>\s*[[\])])$/);
function parseMavenBasedRange(input) {
    if (!input) {
        return null;
    }
    const matchGroups = mavenBasedRangeRegex.exec(input)?.groups;
    if (matchGroups) {
        const { leftBoundStr, separator, rightBoundStr } = matchGroups;
        let leftVal = matchGroups.leftVal;
        let rightVal = matchGroups.rightVal;
        if (!leftVal) {
            leftVal = null;
        }
        if (!rightVal) {
            rightVal = null;
        }
        const isVersionLeft = is_1.default.string(leftVal) && isVersion(leftVal);
        const isVersionRight = is_1.default.string(rightVal) && isVersion(rightVal);
        if ((leftVal === null || isVersionLeft) &&
            (rightVal === null || isVersionRight)) {
            if (isVersionLeft &&
                isVersionRight &&
                leftVal &&
                rightVal &&
                compare(leftVal, rightVal) === 1) {
                return null;
            }
            const leftBound = leftBoundStr.trim() === '['
                ? RangeBound.Inclusive
                : RangeBound.Exclusive;
            const rightBound = rightBoundStr.trim() === ']'
                ? RangeBound.Inclusive
                : RangeBound.Exclusive;
            return {
                leftBound,
                leftBoundStr,
                leftVal,
                separator,
                rightBound,
                rightBoundStr,
                rightVal,
            };
        }
    }
    return null;
}
exports.parseMavenBasedRange = parseMavenBasedRange;
function isValid(str) {
    if (!str) {
        return false;
    }
    return (isVersion(str) || !!parsePrefixRange(str) || !!parseMavenBasedRange(str));
}
exports.isValid = isValid;
//# sourceMappingURL=compare.js.map