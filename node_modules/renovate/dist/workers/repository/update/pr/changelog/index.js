"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangeLogJSON = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../../../logger");
const util_1 = require("../../../../../modules/platform/util");
const allVersioning = tslib_1.__importStar(require("../../../../../modules/versioning"));
const sourceGithub = tslib_1.__importStar(require("./source-github"));
const sourceGitlab = tslib_1.__importStar(require("./source-gitlab"));
tslib_1.__exportStar(require("./types"), exports);
async function getChangeLogJSON(config) {
    const { sourceUrl, versioning, currentVersion, newVersion } = config;
    try {
        if (!(sourceUrl && currentVersion && newVersion)) {
            return null;
        }
        const version = allVersioning.get(versioning);
        if (version.equals(currentVersion, newVersion)) {
            return null;
        }
        logger_1.logger.debug(`Fetching changelog: ${sourceUrl} (${currentVersion} -> ${newVersion})`);
        let res = null;
        const platform = (0, util_1.detectPlatform)(sourceUrl);
        switch (platform) {
            case 'gitlab':
                res = await sourceGitlab.getChangeLogJSON(config);
                break;
            case 'github':
                res = await sourceGithub.getChangeLogJSON(config);
                break;
            default:
                logger_1.logger.info({ sourceUrl, hostType: platform }, 'Unknown platform, skipping changelog fetching.');
                break;
        }
        return res;
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.error({ config, err }, 'getChangeLogJSON error');
        return null;
    }
}
exports.getChangeLogJSON = getChangeLogJSON;
//# sourceMappingURL=index.js.map