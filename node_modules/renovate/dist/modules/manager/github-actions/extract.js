"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const github_tags_1 = require("../../datasource/github-tags");
const dockerVersioning = tslib_1.__importStar(require("../../versioning/docker"));
const extract_1 = require("../dockerfile/extract");
const dockerRe = (0, regex_1.regEx)(/^\s+uses: docker:\/\/([^"]+)\s*$/);
const actionRe = (0, regex_1.regEx)(/^\s+-?\s+?uses: (?<replaceString>['"]?(?<depName>[\w-]+\/[\w-]+)(?<path>\/.*)?@(?<currentValue>[^\s'"]+)['"]?(?:\s+#\s+(?:renovate:\s+)?tag=(?<tag>\S+))?)/);
// SHA1 or SHA256, see https://github.blog/2020-10-19-git-2-29-released/
const shaRe = (0, regex_1.regEx)(/^[a-z0-9]{40}|[a-z0-9]{64}$/);
function extractPackageFile(content) {
    logger_1.logger.trace('github-actions.extractPackageFile()');
    const deps = [];
    for (const line of content.split(regex_1.newlineRegex)) {
        if (line.trim().startsWith('#')) {
            continue;
        }
        const dockerMatch = dockerRe.exec(line);
        if (dockerMatch) {
            const [, currentFrom] = dockerMatch;
            const dep = (0, extract_1.getDep)(currentFrom);
            dep.depType = 'docker';
            dep.versioning = dockerVersioning.id;
            deps.push(dep);
            continue;
        }
        const tagMatch = actionRe.exec(line);
        if (tagMatch?.groups) {
            const { depName, currentValue, path = '', tag, replaceString, } = tagMatch.groups;
            let quotes = '';
            if (replaceString.indexOf("'") >= 0) {
                quotes = "'";
            }
            if (replaceString.indexOf('"') >= 0) {
                quotes = '"';
            }
            const dep = {
                depName,
                commitMessageTopic: '{{{depName}}} action',
                datasource: github_tags_1.GithubTagsDatasource.id,
                versioning: dockerVersioning.id,
                depType: 'action',
                replaceString,
                autoReplaceStringTemplate: `${quotes}{{depName}}${path}@{{#if newDigest}}{{newDigest}}${quotes}{{#if newValue}} # tag={{newValue}}{{/if}}{{/if}}{{#unless newDigest}}{{newValue}}${quotes}{{/unless}}`,
            };
            if (shaRe.test(currentValue)) {
                dep.currentValue = tag;
                dep.currentDigest = currentValue;
            }
            else {
                dep.currentValue = currentValue;
                if (!dockerVersioning.api.isValid(currentValue)) {
                    dep.skipReason = 'invalid-version';
                }
            }
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