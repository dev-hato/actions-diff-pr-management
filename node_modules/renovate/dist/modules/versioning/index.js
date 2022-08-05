"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.getVersionings = exports.getVersioningList = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../logger");
const api_1 = tslib_1.__importDefault(require("./api"));
const common_1 = require("./common");
tslib_1.__exportStar(require("./types"), exports);
const getVersioningList = () => Array.from(api_1.default.keys());
exports.getVersioningList = getVersioningList;
/**
 * Get versioning map. Can be used to dynamically add new versioning type
 */
const getVersionings = () => api_1.default;
exports.getVersionings = getVersionings;
function get(versioning) {
    if (!versioning) {
        logger_1.logger.trace('Missing versioning, using semver as fallback.');
        return api_1.default.get('semver');
    }
    const [versioningName, ...versioningRest] = versioning.split(':');
    const versioningConfig = versioningRest.length
        ? versioningRest.join(':')
        : undefined;
    const theVersioning = api_1.default.get(versioningName);
    if (!theVersioning) {
        logger_1.logger.info({ versioning }, 'Unknown versioning - defaulting to semver');
        return api_1.default.get('semver');
    }
    if ((0, common_1.isVersioningApiConstructor)(theVersioning)) {
        return new theVersioning(versioningConfig);
    }
    return theVersioning;
}
exports.get = get;
//# sourceMappingURL=index.js.map