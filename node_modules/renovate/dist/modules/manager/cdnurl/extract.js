"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = exports.cloudflareUrlRegex = void 0;
const regex_1 = require("../../../util/regex");
const cdnjs_1 = require("../../datasource/cdnjs");
exports.cloudflareUrlRegex = (0, regex_1.regEx)(/\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/(?<depName>[^/]+?)\/(?<currentValue>[^/]+?)\/(?<asset>[-/_.a-zA-Z0-9]+)/);
function extractPackageFile(content) {
    const deps = [];
    let rest = content;
    let match = exports.cloudflareUrlRegex.exec(rest);
    let offset = 0;
    while (match?.groups) {
        const [wholeSubstr] = match;
        const { depName, currentValue, asset } = match.groups;
        offset += match.index + wholeSubstr.length;
        rest = content.slice(offset);
        match = exports.cloudflareUrlRegex.exec(rest);
        deps.push({
            datasource: cdnjs_1.CdnJsDatasource.id,
            depName,
            packageName: `${depName}/${asset}`,
            currentValue,
        });
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map