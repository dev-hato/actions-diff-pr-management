"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLockedDependency = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../../../logger");
const semver_1 = tslib_1.__importDefault(require("../../../../versioning/semver"));
const packageLock = tslib_1.__importStar(require("./package-lock"));
const yarnLock = tslib_1.__importStar(require("./yarn-lock"));
async function updateLockedDependency(config) {
    const { currentVersion, newVersion, lockFile } = config;
    if (!(semver_1.default.isVersion(currentVersion) && semver_1.default.isVersion(newVersion))) {
        logger_1.logger.warn({ config }, 'Update versions are not valid');
        return { status: 'update-failed' };
    }
    if (lockFile.endsWith('package-lock.json')) {
        const res = await packageLock.updateLockedDependency(config);
        return res;
    }
    if (lockFile.endsWith('yarn.lock')) {
        return yarnLock.updateLockedDependency(config);
    }
    logger_1.logger.debug({ lockFile }, 'Unsupported lock file');
    return { status: 'update-failed' };
}
exports.updateLockedDependency = updateLockedDependency;
//# sourceMappingURL=index.js.map