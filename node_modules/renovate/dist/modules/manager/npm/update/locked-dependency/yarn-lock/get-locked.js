"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedDependencies = void 0;
const logger_1 = require("../../../../../../logger");
// Finds matching dependencies withing a package lock file of sub-entry
function getLockedDependencies(yarnLock, depName, currentVersion) {
    const res = [];
    try {
        for (const [depNameConstraint, entry] of Object.entries(yarnLock)) {
            let entryName;
            let constraint;
            const split = depNameConstraint.split('@');
            // istanbul ignore else
            if (split.length === 2) {
                [entryName, constraint] = split;
            }
            else if (split.length === 3) {
                entryName = '@' + split[1];
                constraint = split[2];
            }
            else {
                logger_1.logger.debug({ depNameConstraint, entry }, 'Unexpected depNameConstraint');
                continue;
            }
            if (entryName === depName && entry?.version === currentVersion) {
                res.push({ entry, depNameConstraint, depName, constraint });
            }
        }
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.warn({ err }, 'getLockedDependencies() error');
    }
    return res;
}
exports.getLockedDependencies = getLockedDependencies;
//# sourceMappingURL=get-locked.js.map