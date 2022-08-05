"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceUrl = exports.getDepHost = exports.defaultRegistryUrl = void 0;
const regex_1 = require("../../../util/regex");
const url_1 = require("../../../util/url");
exports.defaultRegistryUrl = 'https://gitlab.com';
function getDepHost(registryUrl = exports.defaultRegistryUrl) {
    return registryUrl.replace((0, regex_1.regEx)(/\/api\/v4$/), '');
}
exports.getDepHost = getDepHost;
function getSourceUrl(packageName, registryUrl) {
    const depHost = getDepHost(registryUrl);
    return (0, url_1.joinUrlParts)(depHost, packageName);
}
exports.getSourceUrl = getSourceUrl;
//# sourceMappingURL=util.js.map