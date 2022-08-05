"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const js_yaml_1 = require("js-yaml");
const constants_1 = require("../../../constants");
const logger_1 = require("../../../logger");
const host_rules_1 = require("../../../util/host-rules");
const regex_1 = require("../../../util/regex");
const github_tags_1 = require("../../datasource/github-tags");
const gitlab_tags_1 = require("../../datasource/gitlab-tags");
const parsing_1 = require("./parsing");
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
/**
 * Determines the datasource(id) to be used for this dependency
 * @param repository the full git url, ie git@github.com/user/project.
 *        Used in debug statements to clearly indicate the related dependency.
 * @param hostname the hostname (ie github.com)
 *        Used to determine which renovate datasource should be used.
 *        Is matched literally against `github.com` and `gitlab.com`.
 *        If that doesn't match, `hostRules.find()` is used to find related sources.
 *        In that case, the hostname is passed on as registryUrl to the corresponding datasource.
 */
function determineDatasource(repository, hostname) {
    if (hostname === 'github.com') {
        logger_1.logger.debug({ repository, hostname }, 'Found github dependency');
        return { datasource: github_tags_1.GithubTagsDatasource.id };
    }
    if (hostname === 'gitlab.com') {
        logger_1.logger.debug({ repository, hostname }, 'Found gitlab dependency');
        return { datasource: gitlab_tags_1.GitlabTagsDatasource.id };
    }
    const hostUrl = 'https://' + hostname;
    const res = (0, host_rules_1.find)({ url: hostUrl });
    if (isEmptyObject(res)) {
        // 1 check, to possibly prevent 3 failures in combined query of hostType & url.
        logger_1.logger.debug({ repository, hostUrl }, 'Provided hostname does not match any hostRules. Ignoring');
        return { skipReason: 'unknown-registry', registryUrls: [hostname] };
    }
    for (const [hostType, sourceId] of [
        [constants_1.PlatformId.Gitea, gitlab_tags_1.GitlabTagsDatasource.id],
        [constants_1.PlatformId.Github, github_tags_1.GithubTagsDatasource.id],
        [constants_1.PlatformId.Gitlab, gitlab_tags_1.GitlabTagsDatasource.id],
    ]) {
        if (!isEmptyObject((0, host_rules_1.find)({ hostType, url: hostUrl }))) {
            logger_1.logger.debug({ repository, hostUrl, hostType }, `Provided hostname matches a ${hostType} hostrule.`);
            return { datasource: sourceId, registryUrls: [hostname] };
        }
    }
    logger_1.logger.debug({ repository, registry: hostUrl }, 'Provided hostname did not match any of the hostRules of hostType gitea,github nor gitlab');
    return { skipReason: 'unknown-registry', registryUrls: [hostname] };
}
function extractDependency(tag, repository) {
    logger_1.logger.debug({ tag }, 'Found version');
    const urlMatchers = [
        // This splits "http://my.github.com/user/repo" -> "my.github.com" "user/repo
        (0, regex_1.regEx)('^https?:\\/\\/(?<hostname>[^\\/]+)\\/(?<depName>\\S*)'),
        // This splits "git@private.registry.com:user/repo" -> "private.registry.com" "user/repo
        (0, regex_1.regEx)('^git@(?<hostname>[^:]+):(?<depName>\\S*)'),
        // This split "git://github.com/pre-commit/pre-commit-hooks" -> "github.com" "pre-commit/pre-commit-hooks"
        (0, regex_1.regEx)(/^git:\/\/(?<hostname>[^/]+)\/(?<depName>\S*)/),
    ];
    for (const urlMatcher of urlMatchers) {
        const match = urlMatcher.exec(repository);
        if (match?.groups) {
            const hostname = match.groups.hostname;
            const depName = match.groups.depName.replace((0, regex_1.regEx)(/\.git$/i), ''); // TODO 12071
            const sourceDef = determineDatasource(repository, hostname);
            return {
                ...sourceDef,
                depName,
                depType: 'repository',
                packageName: depName,
                currentValue: tag,
            };
        }
    }
    logger_1.logger.info({ repository }, 'Could not separate hostname from full dependency url.');
    return {
        depName: undefined,
        depType: 'repository',
        datasource: undefined,
        packageName: undefined,
        skipReason: 'invalid-url',
        currentValue: tag,
    };
}
/**
 * Find all supported dependencies in the pre-commit yaml object.
 *
 * @param precommitFile the parsed yaml config file
 */
function findDependencies(precommitFile) {
    if (!precommitFile.repos) {
        logger_1.logger.debug(`No repos section found, skipping file`);
        return [];
    }
    const packageDependencies = [];
    precommitFile.repos.forEach((item) => {
        if ((0, parsing_1.matchesPrecommitDependencyHeuristic)(item)) {
            logger_1.logger.trace(item, 'Matched pre-commit dependency spec');
            const repository = String(item.repo);
            const tag = String(item.rev);
            const dep = extractDependency(tag, repository);
            packageDependencies.push(dep);
        }
        else {
            logger_1.logger.trace(item, 'Did not find pre-commit repo spec');
        }
    });
    return packageDependencies;
}
function extractPackageFile(content, filename) {
    let parsedContent;
    try {
        parsedContent = (0, js_yaml_1.load)(content, { json: true });
    }
    catch (err) {
        logger_1.logger.debug({ filename, err }, 'Failed to parse pre-commit config YAML');
        return null;
    }
    if (!is_1.default.plainObject(parsedContent)) {
        logger_1.logger.warn({ filename }, `Parsing of pre-commit config YAML returned invalid result`);
        return null;
    }
    if (!(0, parsing_1.matchesPrecommitConfigHeuristic)(parsedContent)) {
        logger_1.logger.debug({ filename }, `File does not look like a pre-commit config file`);
        return null;
    }
    try {
        const deps = findDependencies(parsedContent);
        if (deps.length) {
            logger_1.logger.trace({ deps }, 'Found dependencies in pre-commit config');
            return { deps };
        }
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.warn({ filename, err }, 'Error scanning parsed pre-commit config');
    }
    return null;
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map