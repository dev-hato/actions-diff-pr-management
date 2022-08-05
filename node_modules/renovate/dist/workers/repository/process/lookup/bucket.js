"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBucket = void 0;
function getBucket(config, currentVersion, newVersion, versioning) {
    const { separateMajorMinor, separateMultipleMajor, separateMinorPatch } = config;
    if (!separateMajorMinor) {
        return 'latest';
    }
    const fromMajor = versioning.getMajor(currentVersion);
    const toMajor = versioning.getMajor(newVersion);
    // istanbul ignore if
    if (toMajor === null) {
        return null;
    }
    if (fromMajor !== toMajor) {
        if (separateMultipleMajor) {
            return `major-${toMajor}`;
        }
        return 'major';
    }
    if (separateMinorPatch) {
        if (versioning.getMinor(currentVersion) === versioning.getMinor(newVersion)) {
            return 'patch';
        }
        return 'minor';
    }
    return 'non-major';
}
exports.getBucket = getBucket;
//# sourceMappingURL=bucket.js.map