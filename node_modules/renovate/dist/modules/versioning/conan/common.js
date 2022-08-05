"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSatisfyingVersion = exports.matchesWithOptions = exports.containsOperators = exports.getOptions = exports.cleanVersion = exports.makeVersion = void 0;
const tslib_1 = require("tslib");
const semver = tslib_1.__importStar(require("semver"));
const regex_1 = require("../../../util/regex");
function makeVersion(version, options) {
    const splitVersion = version.split('.');
    const prerelease = semver.prerelease(version, options);
    if (prerelease && !options.includePrerelease) {
        if (!Number.isNaN(parseInt(prerelease.toString()[0], 10))) {
            const stringVersion = `${splitVersion[0]}.${splitVersion[1]}.${splitVersion[2]}`;
            return semver.valid(stringVersion, options);
        }
        return false;
    }
    if (options.loose &&
        !semver.valid(version, options) &&
        splitVersion.length !== 3) {
        return semver.valid(semver.coerce(version, options), options);
    }
    return semver.valid(version, options);
}
exports.makeVersion = makeVersion;
function cleanVersion(version) {
    if (version) {
        return version
            .replace((0, regex_1.regEx)(/,|\[|\]|"|include_prerelease=|loose=|True|False/g), '')
            .trim();
    }
    return version;
}
exports.cleanVersion = cleanVersion;
function getOptions(input) {
    let includePrerelease = false;
    let loose = true;
    if (input) {
        includePrerelease =
            input.includes('include_prerelease=True') &&
                !input.includes('include_prerelease=False');
        loose = input.includes('loose=True') || !input.includes('loose=False');
    }
    return { loose, includePrerelease };
}
exports.getOptions = getOptions;
function containsOperators(input) {
    return (0, regex_1.regEx)('[<=>^~]').test(input);
}
exports.containsOperators = containsOperators;
function matchesWithOptions(version, cleanRange, options) {
    let cleanedVersion = version;
    if (cleanedVersion &&
        semver.prerelease(cleanedVersion) &&
        options.includePrerelease) {
        const coercedVersion = semver.coerce(cleanedVersion)?.raw;
        cleanedVersion = coercedVersion ? coercedVersion : '';
    }
    return semver.satisfies(cleanedVersion, cleanRange, options);
}
exports.matchesWithOptions = matchesWithOptions;
function findSatisfyingVersion(versions, range, compareRt) {
    const options = getOptions(range);
    let cur = null;
    let curSV = null;
    let index = 0;
    let curIndex = -1;
    for (const v of versions) {
        const versionFromList = makeVersion(v, options);
        if (typeof versionFromList === 'string') {
            const cleanedVersion = cleanVersion(versionFromList);
            const options = getOptions(range);
            const cleanRange = cleanVersion(range);
            if (matchesWithOptions(cleanedVersion, cleanRange, options)) {
                if (!cur ||
                    semver.compare(curSV, versionFromList, options) === compareRt) {
                    cur = versionFromList;
                    curIndex = index;
                    curSV = new semver.SemVer(cur, options);
                }
            }
        }
        index += 1;
    }
    if (curIndex >= 0) {
        return versions[curIndex];
    }
    return null;
}
exports.findSatisfyingVersion = findSatisfyingVersion;
//# sourceMappingURL=common.js.map