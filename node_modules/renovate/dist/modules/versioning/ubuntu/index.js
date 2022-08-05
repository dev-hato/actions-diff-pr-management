"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.supportsRanges = exports.urls = exports.displayName = exports.id = void 0;
const regex_1 = require("../../../util/regex");
const distro_1 = require("../distro");
exports.id = 'ubuntu';
exports.displayName = 'Ubuntu';
exports.urls = [
    'https://changelogs.ubuntu.com/meta-release',
    'https://debian.pages.debian.net/distro-info-data/ubuntu.csv',
];
exports.supportsRanges = false;
const di = new distro_1.DistroInfo('data/ubuntu-distro-info.json');
// validation
function isValid(input) {
    return ((typeof input === 'string' &&
        (0, regex_1.regEx)(/^(0[4-5]|[6-9]|[1-9][0-9])\.[0-9][0-9](\.[0-9]{1,2})?$/).test(input)) ||
        di.isCodename(input));
}
function isVersion(input) {
    return isValid(input);
}
function isCompatible(version, _current) {
    return isValid(version);
}
function isSingleVersion(version) {
    return isValid(version);
}
function isStable(version) {
    const ver = di.getVersionByCodename(version);
    if (!isValid(ver)) {
        return false;
    }
    const match = ver.match((0, regex_1.regEx)(/^\d+.\d+/));
    if (!di.isReleased(match ? match[0] : ver)) {
        return false;
    }
    return (0, regex_1.regEx)(/^\d?[02468]\.04/).test(ver);
}
// digestion of version
function getMajor(version) {
    const ver = di.getVersionByCodename(version);
    if (isValid(ver)) {
        const [major] = ver.split('.');
        return parseInt(major, 10);
    }
    return null;
}
function getMinor(version) {
    const ver = di.getVersionByCodename(version);
    if (isValid(ver)) {
        const [, minor] = ver.split('.');
        return parseInt(minor, 10);
    }
    return null;
}
function getPatch(version) {
    const ver = di.getVersionByCodename(version);
    if (isValid(ver)) {
        const [, , patch] = ver.split('.');
        return patch ? parseInt(patch, 10) : null;
    }
    return null;
}
// comparison
function equals(version, other) {
    const ver = di.getVersionByCodename(version);
    const otherVer = di.getVersionByCodename(other);
    return isVersion(ver) && isVersion(otherVer) && ver === otherVer;
}
function isGreaterThan(version, other) {
    const xMajor = getMajor(version) ?? 0;
    const yMajor = getMajor(other) ?? 0;
    if (xMajor > yMajor) {
        return true;
    }
    if (xMajor < yMajor) {
        return false;
    }
    const xMinor = getMinor(version) ?? 0;
    const yMinor = getMinor(other) ?? 0;
    if (xMinor > yMinor) {
        return true;
    }
    if (xMinor < yMinor) {
        return false;
    }
    const xPatch = getPatch(version) ?? 0;
    const yPatch = getPatch(other) ?? 0;
    return xPatch > yPatch;
}
function getSatisfyingVersion(versions, range) {
    return versions.find((version) => equals(version, range)) ? range : null;
}
function minSatisfyingVersion(versions, range) {
    return getSatisfyingVersion(versions, range);
}
function getNewValue({ currentValue, rangeStrategy, currentVersion, newVersion, }) {
    if (di.isCodename(currentValue)) {
        return di.getCodenameByVersion(newVersion);
    }
    return di.getVersionByCodename(newVersion);
}
function sortVersions(version, other) {
    if (equals(version, other)) {
        return 0;
    }
    if (isGreaterThan(version, other)) {
        return 1;
    }
    return -1;
}
function matches(version, range) {
    return equals(version, range);
}
exports.api = {
    isCompatible,
    isSingleVersion,
    isStable,
    isValid,
    isVersion,
    getMajor,
    getMinor,
    getPatch,
    equals,
    isGreaterThan,
    getSatisfyingVersion,
    minSatisfyingVersion,
    getNewValue,
    sortVersions,
    matches,
};
exports.default = exports.api;
//# sourceMappingURL=index.js.map