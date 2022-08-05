"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewValue = exports.toSemverRange = void 0;
const tslib_1 = require("tslib");
const semver_1 = tslib_1.__importDefault(require("semver"));
const regex_1 = require("../../../util/regex");
const fromParam = (0, regex_1.regEx)(/^\s*from\s*:\s*"([^"]+)"\s*$/);
const fromRange = (0, regex_1.regEx)(/^\s*"([^"]+)"\s*\.\.\.\s*$/);
const binaryRange = (0, regex_1.regEx)(/^\s*"([^"]+)"\s*(\.\.[.<])\s*"([^"]+)"\s*$/);
const toRange = (0, regex_1.regEx)(/^\s*(\.\.[.<])\s*"([^"]+)"\s*$/);
function toSemverRange(range) {
    const fromParamMatch = fromParam.exec(range);
    if (fromParamMatch) {
        const [, version] = fromParamMatch;
        if (semver_1.default.valid(version)) {
            const nextMajor = `${semver_1.default.major(version) + 1}.0.0`;
            return `>=${version} <${nextMajor}`;
        }
        return null;
    }
    const fromRangeMatch = fromRange.exec(range);
    if (fromRangeMatch) {
        const [, version] = fromRangeMatch;
        if (semver_1.default.valid(version)) {
            return `>=${version}`;
        }
        return null;
    }
    const binaryRangeMatch = binaryRange.exec(range);
    if (binaryRangeMatch) {
        const [, currentVersion, op, newVersion] = binaryRangeMatch;
        if (semver_1.default.valid(currentVersion) && semver_1.default.valid(newVersion)) {
            return op === '..<'
                ? `>=${currentVersion} <${newVersion}`
                : `>=${currentVersion} <=${newVersion}`;
        }
        return null;
    }
    const toRangeMatch = toRange.exec(range);
    if (toRangeMatch) {
        const [, op, newVersion] = toRangeMatch;
        if (semver_1.default.valid(newVersion)) {
            return op === '..<' ? `<${newVersion}` : `<=${newVersion}`;
        }
    }
    return null;
}
exports.toSemverRange = toSemverRange;
function getNewValue({ currentValue, newVersion }) {
    if (fromParam.test(currentValue)) {
        return currentValue.replace((0, regex_1.regEx)(/".*?"/), `"${newVersion}"`);
    }
    const fromRangeMatch = fromRange.exec(currentValue);
    if (fromRangeMatch) {
        const [, version] = fromRangeMatch;
        return currentValue.replace(version, newVersion);
    }
    const binaryRangeMatch = binaryRange.exec(currentValue);
    if (binaryRangeMatch) {
        const [, , , version] = binaryRangeMatch;
        return currentValue.replace(version, newVersion);
    }
    const toRangeMatch = toRange.exec(currentValue);
    if (toRangeMatch) {
        const [, , version] = toRangeMatch;
        return currentValue.replace(version, newVersion);
    }
    return currentValue;
}
exports.getNewValue = getNewValue;
//# sourceMappingURL=range.js.map