"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdateType = void 0;
function getUpdateType(config, versioning, currentVersion, newVersion) {
    if (versioning.getMajor(newVersion) > versioning.getMajor(currentVersion)) {
        return 'major';
    }
    if (versioning.getMinor(newVersion) > versioning.getMinor(currentVersion)) {
        return 'minor';
    }
    return 'patch';
}
exports.getUpdateType = getUpdateType;
//# sourceMappingURL=update-type.js.map