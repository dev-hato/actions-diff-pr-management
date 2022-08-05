"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestLimit = exports.applyHostRules = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../constants");
const logger_1 = require("../../logger");
const proxy_1 = require("../../proxy");
const hostRules = tslib_1.__importStar(require("../host-rules"));
function findMatchingRules(options, url) {
    const { hostType } = options;
    let res = hostRules.find({ hostType, url });
    if (res.token || res.username || res.password) {
        // do not fallback if we already have auth infos
        return res;
    }
    // Fallback to `github` hostType
    if (hostType &&
        constants_1.GITHUB_API_USING_HOST_TYPES.includes(hostType) &&
        hostType !== constants_1.PlatformId.Github) {
        res = {
            ...hostRules.find({
                hostType: constants_1.PlatformId.Github,
                url,
            }),
            ...res,
        };
    }
    // Fallback to `gitlab` hostType
    if (hostType &&
        constants_1.GITLAB_API_USING_HOST_TYPES.includes(hostType) &&
        hostType !== constants_1.PlatformId.Gitlab) {
        res = {
            ...hostRules.find({
                hostType: constants_1.PlatformId.Gitlab,
                url,
            }),
            ...res,
        };
    }
    // Fallback to `bitbucket` hostType
    if (hostType &&
        constants_1.BITBUCKET_API_USING_HOST_TYPES.includes(hostType) &&
        hostType !== constants_1.PlatformId.Bitbucket) {
        res = {
            ...hostRules.find({
                hostType: constants_1.PlatformId.Bitbucket,
                url,
            }),
            ...res,
        };
    }
    return res;
}
// Apply host rules to requests
function applyHostRules(url, inOptions) {
    const options = { ...inOptions };
    const foundRules = findMatchingRules(options, url);
    const { username, password, token, enabled, authType } = foundRules;
    if (options.noAuth) {
        logger_1.logger.trace({ url }, `Authorization disabled`);
    }
    else if (options.headers?.authorization ||
        options.password ||
        options.token) {
        logger_1.logger.trace({ url }, `Authorization already set`);
    }
    else if (password !== undefined) {
        logger_1.logger.trace({ url }, `Applying Basic authentication`);
        options.username = username;
        options.password = password;
    }
    else if (token) {
        logger_1.logger.trace({ url }, `Applying Bearer authentication`);
        options.token = token;
        options.context = { ...options.context, authType };
    }
    else if (enabled === false) {
        options.enabled = false;
    }
    // Apply optional params
    if (foundRules.abortOnError) {
        options.abortOnError = foundRules.abortOnError;
    }
    if (foundRules.abortIgnoreStatusCodes) {
        options.abortIgnoreStatusCodes = foundRules.abortIgnoreStatusCodes;
    }
    if (foundRules.timeout) {
        options.timeout = foundRules.timeout;
    }
    if (!(0, proxy_1.hasProxy)() && foundRules.enableHttp2 === true) {
        options.http2 = true;
    }
    return options;
}
exports.applyHostRules = applyHostRules;
function getRequestLimit(url) {
    const hostRule = hostRules.find({
        url,
    });
    const limit = hostRule.concurrentRequestLimit;
    return typeof limit === 'number' && limit > 0 ? limit : null;
}
exports.getRequestLimit = getRequestLimit;
//# sourceMappingURL=host-rules.js.map