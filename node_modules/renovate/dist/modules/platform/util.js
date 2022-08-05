"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPlatform = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../constants");
const hostRules = tslib_1.__importStar(require("../../util/host-rules"));
const url_1 = require("../../util/url");
/**
 * Tries to detect the `platform from a url.
 *
 * @param url the url to detect platform from
 * @returns matched `platform` if found, otherwise `null`
 */
function detectPlatform(url) {
    const { hostname } = (0, url_1.parseUrl)(url) ?? {};
    if (hostname === 'github.com' || hostname?.includes('github')) {
        return 'github';
    }
    if (hostname === 'gitlab.com' || hostname?.includes('gitlab')) {
        return 'gitlab';
    }
    const hostType = hostRules.hostType({ url: url });
    if (!hostType) {
        return null;
    }
    if (constants_1.GITLAB_API_USING_HOST_TYPES.includes(hostType)) {
        return 'gitlab';
    }
    if (constants_1.GITHUB_API_USING_HOST_TYPES.includes(hostType)) {
        return 'github';
    }
    return null;
}
exports.detectPlatform = detectPlatform;
//# sourceMappingURL=util.js.map