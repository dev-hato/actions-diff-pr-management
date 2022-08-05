"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const github_tags_1 = require("../../datasource/github-tags");
const semver_1 = require("../../versioning/semver");
function extractPackageFile(content) {
    const deps = [];
    try {
        const lines = content.split(regex_1.newlineRegex);
        for (const line of lines) {
            // Search each line for plugin names
            const depLineMatch = (0, regex_1.regEx)(/^\s*(?:-\s+(?:\?\s+)?)?(?<depName>[^#\s]+)#(?<currentValue>[^:]+)/).exec(line);
            if (depLineMatch?.groups) {
                const { depName, currentValue } = depLineMatch.groups;
                logger_1.logger.trace('depLineMatch');
                let skipReason;
                let repo;
                logger_1.logger.debug({ depName }, 'Found BuildKite plugin');
                // Plugins may simply be git repos. If so, we need to parse out the registry.
                const gitPluginMatch = (0, regex_1.regEx)(/(ssh:\/\/git@|https:\/\/)(?<registry>[^/]+)\/(?<gitPluginName>.*)/).exec(depName);
                if (gitPluginMatch?.groups) {
                    logger_1.logger.debug('Examining git plugin');
                    const { registry, gitPluginName } = gitPluginMatch.groups;
                    const gitDepName = gitPluginName.replace((0, regex_1.regEx)('\\.git$'), '');
                    const dep = {
                        depName: gitDepName,
                        currentValue: currentValue,
                        registryUrls: ['https://' + registry],
                        datasource: github_tags_1.GithubTagsDatasource.id,
                    };
                    deps.push(dep);
                    continue;
                }
                else if ((0, semver_1.isVersion)(currentValue)) {
                    const splitName = depName.split('/');
                    if (splitName.length === 1) {
                        repo = `buildkite-plugins/${depName}-buildkite-plugin`;
                    }
                    else if (splitName.length === 2) {
                        repo = `${depName}-buildkite-plugin`;
                    }
                    else {
                        logger_1.logger.warn({ dependency: depName }, 'Something is wrong with BuildKite plugin name');
                        skipReason = 'invalid-dependency-specification';
                    }
                }
                else {
                    logger_1.logger.debug({ currentValue }, 'Skipping non-pinned current version');
                    skipReason = 'invalid-version';
                }
                const dep = {
                    depName,
                    currentValue,
                    skipReason,
                };
                if (repo) {
                    dep.datasource = github_tags_1.GithubTagsDatasource.id;
                    dep.packageName = repo;
                }
                deps.push(dep);
            }
        }
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.warn({ err }, 'Error extracting BuildKite plugins');
    }
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map