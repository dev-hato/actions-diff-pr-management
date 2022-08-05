"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedDependencies = void 0;
const logger_1 = require("../../../../../../logger");
// Finds matching dependencies withing a package lock file of sub-entry
function getLockedDependencies(entry, depName, currentVersion, bundled = false) {
    let res = [];
    try {
        const { dependencies } = entry;
        if (!dependencies) {
            return [];
        }
        const dep = dependencies[depName];
        if (dep && (currentVersion === null || dep?.version === currentVersion)) {
            if (bundled || entry.bundled) {
                dep.bundled = true;
            }
            res.push(dep);
        }
        for (const dependency of Object.values(dependencies)) {
            res = res.concat(getLockedDependencies(dependency, depName, currentVersion, bundled || !!entry.bundled));
        }
    }
    catch (err) {
        logger_1.logger.warn({ err }, 'getLockedDependencies() error');
    }
    return res;
}
exports.getLockedDependencies = getLockedDependencies;
//# sourceMappingURL=get-locked.js.map