"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = exports.gitDep = exports.parseLine = void 0;
const logger_1 = require("../../../logger");
const fs_1 = require("../../../util/fs");
const regex_1 = require("../../../util/regex");
const git_tags_1 = require("../../datasource/git-tags");
const github_tags_1 = require("../../datasource/github-tags");
const gitlab_tags_1 = require("../../datasource/gitlab-tags");
const pod_1 = require("../../datasource/pod");
const regexMappings = [
    (0, regex_1.regEx)(`^\\s*pod\\s+(['"])(?<spec>[^'"/]+)(\\/(?<subspec>[^'"]+))?(['"])`),
    (0, regex_1.regEx)(`^\\s*pod\\s+(['"])[^'"]+(['"])\\s*,\\s*(['"])(?<currentValue>[^'"]+)(['"])\\s*$`),
    (0, regex_1.regEx)(`,\\s*:git\\s*=>\\s*(['"])(?<git>[^'"]+)(['"])`),
    (0, regex_1.regEx)(`,\\s*:tag\\s*=>\\s*(['"])(?<tag>[^'"]+)(['"])`),
    (0, regex_1.regEx)(`,\\s*:path\\s*=>\\s*(['"])(?<path>[^'"]+)(['"])`),
    (0, regex_1.regEx)(`^\\s*source\\s*(['"])(?<source>[^'"]+)(['"])`),
];
function parseLine(line) {
    let result = {};
    if (!line) {
        return result;
    }
    for (const regex of Object.values(regexMappings)) {
        const match = regex.exec(line.replace((0, regex_1.regEx)(/#.*$/), ''));
        if (match?.groups) {
            result = { ...result, ...match.groups };
        }
    }
    if (result.spec) {
        const depName = result.subspec
            ? `${result.spec}/${result.subspec}`
            : result.spec;
        const groupName = result.spec;
        if (depName) {
            result.depName = depName;
        }
        if (groupName) {
            result.groupName = groupName;
        }
        delete result.spec;
        delete result.subspec;
    }
    return result;
}
exports.parseLine = parseLine;
function gitDep(parsedLine) {
    const { depName, git, tag } = parsedLine;
    const platformMatch = (0, regex_1.regEx)(/[@/](?<platform>github|gitlab)\.com[:/](?<account>[^/]+)\/(?<repo>[^/]+)/).exec(git ?? '');
    if (platformMatch?.groups) {
        const { account, repo, platform } = platformMatch.groups;
        if (account && repo) {
            const datasource = platform === 'github'
                ? github_tags_1.GithubTagsDatasource.id
                : gitlab_tags_1.GitlabTagsDatasource.id;
            return {
                datasource,
                depName,
                packageName: `${account}/${repo.replace((0, regex_1.regEx)(/\.git$/), '')}`,
                currentValue: tag,
            };
        }
    }
    return {
        datasource: git_tags_1.GitTagsDatasource.id,
        depName,
        packageName: git,
        currentValue: tag,
    };
}
exports.gitDep = gitDep;
async function extractPackageFile(content, fileName) {
    logger_1.logger.trace('cocoapods.extractPackageFile()');
    const deps = [];
    const lines = content.split(regex_1.newlineRegex);
    const registryUrls = [];
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
        const line = lines[lineNumber];
        const parsedLine = parseLine(line);
        const { depName, groupName, currentValue, git, tag, path, source, } = parsedLine;
        if (source) {
            registryUrls.push(source.replace((0, regex_1.regEx)(/\/*$/), ''));
        }
        if (depName) {
            const managerData = { lineNumber };
            let dep = {
                depName,
                groupName,
                skipReason: 'unknown-version',
            };
            if (currentValue) {
                dep = {
                    depName,
                    groupName,
                    datasource: pod_1.PodDatasource.id,
                    currentValue,
                    managerData,
                    registryUrls,
                };
            }
            else if (git) {
                if (tag) {
                    dep = { ...gitDep(parsedLine), managerData };
                }
                else {
                    dep = {
                        depName,
                        groupName,
                        skipReason: 'git-dependency',
                    };
                }
            }
            else if (path) {
                dep = {
                    depName,
                    groupName,
                    skipReason: 'path-dependency',
                };
            }
            deps.push(dep);
        }
    }
    const res = { deps };
    const lockFile = (0, fs_1.getSiblingFileName)(fileName, 'Podfile.lock');
    // istanbul ignore if
    if (await (0, fs_1.localPathExists)(lockFile)) {
        res.lockFiles = [lockFile];
    }
    return res;
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map