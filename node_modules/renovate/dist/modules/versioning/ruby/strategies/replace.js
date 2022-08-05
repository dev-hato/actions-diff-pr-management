"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPrecision = void 0;
const tslib_1 = require("tslib");
const ruby_semver_1 = require("@renovatebot/ruby-semver");
const logger_1 = require("../../../../logger");
const bump_1 = tslib_1.__importDefault(require("./bump"));
function countInstancesOf(str, char) {
    return str.split(char).length - 1;
}
function isMajorRange(range) {
    const splitRange = range.split(',').map((part) => part.trim());
    return (splitRange.length === 1 &&
        splitRange[0]?.startsWith('~>') &&
        countInstancesOf(splitRange[0], '.') === 0);
}
function isCommonRubyMajorRange(range) {
    const splitRange = range.split(',').map((part) => part.trim());
    return (splitRange.length === 2 &&
        splitRange[0]?.startsWith('~>') &&
        countInstancesOf(splitRange[0], '.') === 1 &&
        splitRange[1]?.startsWith('>='));
}
function isCommonRubyMinorRange(range) {
    const splitRange = range.split(',').map((part) => part.trim());
    return (splitRange.length === 2 &&
        splitRange[0]?.startsWith('~>') &&
        countInstancesOf(splitRange[0], '.') === 2 &&
        splitRange[1]?.startsWith('>='));
}
function reduceOnePrecision(version) {
    const versionParts = version.split('.');
    // istanbul ignore if
    if (versionParts.length === 1) {
        return version;
    }
    versionParts.pop();
    return versionParts.join('.');
}
function matchPrecision(existing, next) {
    let res = next;
    while (res.split('.').length > existing.split('.').length) {
        res = reduceOnePrecision(res);
    }
    return res;
}
exports.matchPrecision = matchPrecision;
exports.default = ({ to, range }) => {
    if ((0, ruby_semver_1.satisfies)(to, range)) {
        return range;
    }
    let newRange;
    if (isCommonRubyMajorRange(range)) {
        const firstPart = reduceOnePrecision(to);
        newRange = `~> ${firstPart}, >= ${to}`;
    }
    else if (isCommonRubyMinorRange(range)) {
        const firstPart = reduceOnePrecision(to) + '.0';
        newRange = `~> ${firstPart}, >= ${to}`;
    }
    else if (isMajorRange(range)) {
        const majorPart = to.split('.')[0];
        newRange = '~>' + (range.includes(' ') ? ' ' : '') + majorPart;
    }
    else {
        const lastPart = range
            .split(',')
            .map((part) => part.trim())
            .slice(-1)
            .join();
        const lastPartPrecision = lastPart.split('.').length;
        const toPrecision = to.split('.').length;
        let massagedTo = to;
        if (!lastPart.startsWith('<') && toPrecision > lastPartPrecision) {
            massagedTo = to.split('.').slice(0, lastPartPrecision).join('.');
        }
        const newLastPart = (0, bump_1.default)({ to: massagedTo, range: lastPart });
        newRange = range.replace(lastPart, newLastPart);
        const firstPart = range
            .split(',')
            .map((part) => part.trim())
            .shift();
        if (firstPart && !(0, ruby_semver_1.satisfies)(to, firstPart)) {
            let newFirstPart = (0, bump_1.default)({ to: massagedTo, range: firstPart });
            newFirstPart = matchPrecision(firstPart, newFirstPart);
            newRange = newRange.replace(firstPart, newFirstPart);
        }
    }
    // istanbul ignore if
    if (!(0, ruby_semver_1.satisfies)(to, newRange)) {
        logger_1.logger.warn({ range, to, newRange }, 'Ruby versioning getNewValue problem: to version is not satisfied by new range');
        return range;
    }
    return newRange;
};
//# sourceMappingURL=replace.js.map