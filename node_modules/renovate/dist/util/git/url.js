"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoteUrlWithToken = exports.getHttpUrl = void 0;
const tslib_1 = require("tslib");
const git_url_parse_1 = tslib_1.__importDefault(require("git-url-parse"));
const logger_1 = require("../../logger");
const hostRules = tslib_1.__importStar(require("../host-rules"));
const regex_1 = require("../regex");
function getHttpUrl(url, token) {
    const parsedUrl = (0, git_url_parse_1.default)(url);
    parsedUrl.token = token ?? '';
    const protocol = (0, regex_1.regEx)(/^https?$/).exec(parsedUrl.protocol)
        ? parsedUrl.protocol
        : 'https';
    return parsedUrl.toString(protocol);
}
exports.getHttpUrl = getHttpUrl;
function getRemoteUrlWithToken(url, hostType) {
    const hostRule = hostRules.find({ url, hostType });
    if (hostRule?.token) {
        logger_1.logger.debug(`Found hostRules token for url ${url}`);
        return getHttpUrl(url, encodeURIComponent(hostRule.token));
    }
    if (hostRule?.username && hostRule?.password) {
        logger_1.logger.debug(`Found hostRules username and password for url ${url}`);
        const encodedUsername = encodeURIComponent(hostRule.username);
        const encodedPassword = encodeURIComponent(hostRule.password);
        return getHttpUrl(url, `${encodedUsername}:${encodedPassword}`);
    }
    return url;
}
exports.getRemoteUrlWithToken = getRemoteUrlWithToken;
//# sourceMappingURL=url.js.map