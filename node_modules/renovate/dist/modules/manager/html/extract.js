"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = exports.extractDep = void 0;
const regex_1 = require("../../../util/regex");
const cdnjs_1 = require("../../datasource/cdnjs");
const extract_1 = require("../cdnurl/extract");
const regex = (0, regex_1.regEx)(/<\s*(script|link)\s+[^>]*?\/?>/i);
const integrityRegex = (0, regex_1.regEx)(/\s+integrity\s*=\s*("|')(?<currentDigest>[^"']+)/);
function extractDep(tag) {
    const match = extract_1.cloudflareUrlRegex.exec(tag);
    if (!match?.groups) {
        return null;
    }
    const { depName, currentValue, asset } = match.groups;
    const dep = {
        datasource: cdnjs_1.CdnJsDatasource.id,
        depName,
        packageName: `${depName}/${asset}`,
        currentValue,
        replaceString: tag,
    };
    const integrityMatch = integrityRegex.exec(tag);
    if (integrityMatch?.groups) {
        dep.currentDigest = integrityMatch.groups.currentDigest;
    }
    return dep;
}
exports.extractDep = extractDep;
function extractPackageFile(content) {
    const deps = [];
    let rest = content;
    let match = regex.exec(rest);
    let offset = 0;
    while (match) {
        const [replaceString] = match;
        offset += match.index + replaceString.length;
        rest = content.slice(offset);
        match = regex.exec(rest);
        const dep = extractDep(replaceString);
        if (dep) {
            deps.push(dep);
        }
    }
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map