"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestVersion = exports.normalizeRootRelativeUrls = exports.parseIndexDir = void 0;
const regex_1 = require("../../../util/regex");
const compare_1 = require("../../versioning/maven/compare");
const linkRegExp = /(?<=href=['"])[^'"]*(?=\/['"])/gi;
function parseIndexDir(content, filterFn = (x) => !(0, regex_1.regEx)(/^\.+/).test(x)) {
    const unfiltered = content.match(linkRegExp) ?? [];
    return unfiltered.filter(filterFn);
}
exports.parseIndexDir = parseIndexDir;
function normalizeRootRelativeUrls(content, rootUrl) {
    const rootRelativePath = new URL(rootUrl.toString()).pathname;
    return content.replace(linkRegExp, (href) => href.replace(rootRelativePath, ''));
}
exports.normalizeRootRelativeUrls = normalizeRootRelativeUrls;
function getLatestVersion(versions) {
    if (versions?.length) {
        return versions.reduce((latestVersion, version) => (0, compare_1.compare)(version, latestVersion) === 1 ? version : latestVersion);
    }
    return null;
}
exports.getLatestVersion = getLatestVersion;
//# sourceMappingURL=util.js.map