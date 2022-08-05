"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentVersion = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const logger_1 = require("../../../../logger");
const regex_1 = require("../../../../util/regex");
function getCurrentVersion(currentValue, lockedVersion, versioning, rangeStrategy, latestVersion, allVersions) {
    // istanbul ignore if
    if (!is_1.default.string(currentValue)) {
        return null;
    }
    if (versioning.isVersion(currentValue)) {
        return currentValue;
    }
    if (versioning.isSingleVersion(currentValue)) {
        return currentValue.replace((0, regex_1.regEx)(/=/g), '').trim();
    }
    logger_1.logger.trace(`currentValue ${currentValue} is range`);
    let useVersions = allVersions.filter((v) => versioning.matches(v, currentValue));
    if (latestVersion && versioning.matches(latestVersion, currentValue)) {
        useVersions = useVersions.filter((v) => !versioning.isGreaterThan(v, latestVersion));
    }
    if (rangeStrategy === 'pin') {
        return (lockedVersion ||
            versioning.getSatisfyingVersion(useVersions, currentValue));
    }
    if (rangeStrategy === 'bump') {
        // Use the lowest version in the current range
        return versioning.minSatisfyingVersion(useVersions, currentValue);
    }
    // Use the highest version in the current range
    return versioning.getSatisfyingVersion(useVersions, currentValue);
}
exports.getCurrentVersion = getCurrentVersion;
//# sourceMappingURL=current.js.map