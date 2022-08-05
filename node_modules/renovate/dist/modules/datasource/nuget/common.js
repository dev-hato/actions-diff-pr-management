"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRegistryUrl = exports.massageUrl = exports.removeBuildMeta = void 0;
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const url_1 = require("../../../util/url");
const buildMetaRe = (0, regex_1.regEx)(/\+.+$/g);
function removeBuildMeta(version) {
    return version.replace(buildMetaRe, '');
}
exports.removeBuildMeta = removeBuildMeta;
const urlWhitespaceRe = (0, regex_1.regEx)(/\s/g);
function massageUrl(url) {
    let resultUrl = url;
    // During `dotnet pack` certain URLs are being URL decoded which may introduce whitespaces
    // and causes Markdown link generation problems.
    resultUrl = resultUrl.replace(urlWhitespaceRe, '%20');
    return resultUrl;
}
exports.massageUrl = massageUrl;
const protocolVersionRegExp = (0, regex_1.regEx)(/#protocolVersion=(?<protocol>2|3)/);
function parseRegistryUrl(registryUrl) {
    const parsedUrl = (0, url_1.parseUrl)(registryUrl);
    if (!parsedUrl) {
        logger_1.logger.debug({ urL: registryUrl }, `nuget registry failure: can't parse ${registryUrl}`);
        return { feedUrl: registryUrl, protocolVersion: null };
    }
    let protocolVersion = 2;
    const protocolVersionMatch = protocolVersionRegExp.exec(parsedUrl.hash)?.groups;
    if (protocolVersionMatch) {
        const { protocol } = protocolVersionMatch;
        parsedUrl.hash = '';
        protocolVersion = Number.parseInt(protocol, 10);
    }
    else if (parsedUrl.pathname.endsWith('.json')) {
        protocolVersion = 3;
    }
    const feedUrl = parsedUrl.href;
    return { feedUrl, protocolVersion };
}
exports.parseRegistryUrl = parseRegistryUrl;
//# sourceMappingURL=common.js.map