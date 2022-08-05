"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.getSatisfyingVersion = exports.isValid = exports.isVersion = exports.supportsRanges = exports.urls = exports.displayName = exports.id = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const semver_stable_1 = tslib_1.__importDefault(require("semver-stable"));
const regex_1 = require("../../../util/regex");
exports.id = 'semver-coerced';
exports.displayName = 'Coerced Semantic Versioning';
exports.urls = ['https://semver.org/'];
exports.supportsRanges = false;
const { is: isStable } = semver_stable_1.default;
function sortVersions(a, b) {
    const aCoerced = semver_1.default.coerce(a);
    const bCoerced = semver_1.default.coerce(b);
    return aCoerced && bCoerced ? semver_1.default.compare(aCoerced, bCoerced) : 0;
}
function getMajor(a) {
    const aCoerced = semver_1.default.coerce(a);
    return aCoerced ? semver_1.default.major(aCoerced) : null;
}
function getMinor(a) {
    const aCoerced = semver_1.default.coerce(a);
    return aCoerced ? semver_1.default.minor(aCoerced) : null;
}
function getPatch(a) {
    return semver_1.default.patch(a);
}
function matches(version, range) {
    const coercedVersion = semver_1.default.coerce(version);
    return coercedVersion ? semver_1.default.satisfies(coercedVersion, range) : false;
}
function equals(a, b) {
    const aCoerced = semver_1.default.coerce(a);
    const bCoerced = semver_1.default.coerce(b);
    return aCoerced && bCoerced ? semver_1.default.eq(aCoerced, bCoerced) : false;
}
function isValid(version) {
    return !!semver_1.default.valid(semver_1.default.coerce(version));
}
function getSatisfyingVersion(versions, range) {
    const coercedVersions = versions
        .map((version) => semver_1.default.coerce(version)?.version)
        .filter(is_1.default.string);
    return semver_1.default.maxSatisfying(coercedVersions, range);
}
exports.getSatisfyingVersion = getSatisfyingVersion;
function minSatisfyingVersion(versions, range) {
    const coercedVersions = versions
        .map((version) => semver_1.default.coerce(version)?.version)
        .filter(is_1.default.string);
    return semver_1.default.minSatisfying(coercedVersions, range);
}
function isLessThanRange(version, range) {
    const coercedVersion = semver_1.default.coerce(version);
    return coercedVersion ? semver_1.default.ltr(coercedVersion, range) : false;
}
function isGreaterThan(version, other) {
    const coercedVersion = semver_1.default.coerce(version);
    const coercedOther = semver_1.default.coerce(other);
    return coercedVersion && coercedOther
        ? semver_1.default.gt(coercedVersion, coercedOther)
        : false;
}
const startsWithNumberRegex = (0, regex_1.regEx)(`^\\d`);
function isSingleVersion(version) {
    // Since coercion accepts ranges as well as versions, we have to manually
    // check that the version string starts with either 'v' or a digit.
    if (!version.startsWith('v') && !startsWithNumberRegex.exec(version)) {
        return false;
    }
    return !!semver_1.default.valid(semver_1.default.coerce(version));
}
// If this is left as an alias, inputs like "17.04.0" throw errors
const isVersion = (input) => isValid(input);
exports.isVersion = isVersion;
exports.isValid = exports.isVersion;
function getNewValue({ newVersion }) {
    return newVersion;
}
function isCompatible(version) {
    return (0, exports.isVersion)(version);
}
exports.api = {
    equals,
    getMajor,
    getMinor,
    getPatch,
    isCompatible,
    isGreaterThan,
    isLessThanRange,
    isSingleVersion,
    isStable,
    isValid,
    isVersion: exports.isVersion,
    matches,
    getSatisfyingVersion,
    minSatisfyingVersion,
    getNewValue,
    sortVersions,
};
exports.default = exports.api;
//# sourceMappingURL=index.js.map