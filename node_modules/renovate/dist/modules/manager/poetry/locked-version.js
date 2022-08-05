"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLockFileEntries = void 0;
const toml_1 = require("@iarna/toml");
const logger_1 = require("../../../logger");
function extractLockFileEntries(lockFileContent) {
    let poetryLockfile = {};
    try {
        poetryLockfile = (0, toml_1.parse)(lockFileContent);
    }
    catch (err) {
        logger_1.logger.debug({ err }, 'Error parsing poetry.lock file');
    }
    const lockfileMapping = {};
    if (poetryLockfile?.package) {
        // Create a package->version mapping
        for (const poetryPackage of poetryLockfile.package) {
            if (poetryPackage.name && poetryPackage.version) {
                lockfileMapping[poetryPackage.name] = poetryPackage.version;
            }
        }
    }
    return lockfileMapping;
}
exports.extractLockFileEntries = extractLockFileEntries;
//# sourceMappingURL=locked-version.js.map