"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLinkHeader = exports.createURLFromHostOrURL = exports.parseUrl = exports.validateUrl = exports.getQueryString = exports.resolveBaseUrl = exports.trimLeadingSlash = exports.trimTrailingSlash = exports.ensureTrailingSlash = exports.ensurePathPrefix = exports.joinUrlParts = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
// eslint-disable-next-line no-restricted-imports
const parse_link_header_1 = tslib_1.__importDefault(require("parse-link-header"));
const url_join_1 = tslib_1.__importDefault(require("url-join"));
const logger_1 = require("../logger");
const regex_1 = require("./regex");
function joinUrlParts(...parts) {
    return (0, url_join_1.default)(...parts);
}
exports.joinUrlParts = joinUrlParts;
function ensurePathPrefix(url, prefix) {
    const parsed = new URL(url);
    const fullPath = parsed.pathname + parsed.search;
    if (fullPath.startsWith(prefix)) {
        return url;
    }
    return parsed.origin + prefix + fullPath;
}
exports.ensurePathPrefix = ensurePathPrefix;
function ensureTrailingSlash(url) {
    return url.replace(/\/?$/, '/'); // TODO #12875 adds slash at the front when re2 is used
}
exports.ensureTrailingSlash = ensureTrailingSlash;
function trimTrailingSlash(url) {
    return url.replace((0, regex_1.regEx)(/\/+$/), '');
}
exports.trimTrailingSlash = trimTrailingSlash;
function trimLeadingSlash(path) {
    return path.replace(/^\//, '');
}
exports.trimLeadingSlash = trimLeadingSlash;
function resolveBaseUrl(baseUrl, input) {
    const inputString = input.toString();
    let host;
    let pathname;
    try {
        ({ host, pathname } = new URL(inputString));
    }
    catch (e) {
        pathname = inputString;
    }
    return host ? inputString : (0, url_join_1.default)(baseUrl, pathname || '');
}
exports.resolveBaseUrl = resolveBaseUrl;
function getQueryString(params) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (Array.isArray(v)) {
            for (const item of v) {
                usp.append(k, item.toString());
            }
        }
        else {
            usp.append(k, v.toString());
        }
    }
    const res = usp.toString();
    return res;
}
exports.getQueryString = getQueryString;
function validateUrl(url, httpOnly = true) {
    if (!url) {
        return false;
    }
    try {
        const { protocol } = new URL(url);
        return httpOnly ? !!protocol.startsWith('http') : !!protocol;
    }
    catch (err) {
        return false;
    }
}
exports.validateUrl = validateUrl;
function parseUrl(url) {
    if (!url) {
        return null;
    }
    try {
        return new URL(url);
    }
    catch (err) {
        return null;
    }
}
exports.parseUrl = parseUrl;
/**
 * Tries to create an URL object from either a full URL string or a hostname
 * @param url either the full url or a hostname
 * @returns an URL object or null
 */
function createURLFromHostOrURL(url) {
    return parseUrl(url) ?? parseUrl(`https://${url}`);
}
exports.createURLFromHostOrURL = createURLFromHostOrURL;
function parseLinkHeader(linkHeader) {
    if (!is_1.default.nonEmptyString(linkHeader)) {
        return null;
    }
    if (linkHeader.length > 2000) {
        logger_1.logger.warn({ linkHeader }, 'Link header too long.');
        return null;
    }
    return (0, parse_link_header_1.default)(linkHeader);
}
exports.parseLinkHeader = parseLinkHeader;
//# sourceMappingURL=url.js.map