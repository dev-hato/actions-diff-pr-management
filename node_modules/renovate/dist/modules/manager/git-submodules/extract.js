"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const url_1 = tslib_1.__importDefault(require("url"));
const simple_git_1 = tslib_1.__importDefault(require("simple-git"));
const upath_1 = tslib_1.__importDefault(require("upath"));
const global_1 = require("../../../config/global");
const logger_1 = require("../../../logger");
const config_1 = require("../../../util/git/config");
const url_2 = require("../../../util/git/url");
const regex_1 = require("../../../util/regex");
const git_refs_1 = require("../../datasource/git-refs");
async function getUrl(git, gitModulesPath, submoduleName) {
    const path = (await (0, simple_git_1.default)((0, config_1.simpleGitConfig)()).raw([
        'config',
        '--file',
        gitModulesPath,
        '--get',
        `submodule.${submoduleName}.url`,
    ]))?.trim();
    if (!path?.startsWith('../')) {
        return path;
    }
    const remoteUrl = (await git.raw(['config', '--get', 'remote.origin.url'])).trim();
    return url_1.default.resolve(`${remoteUrl}/`, path);
}
const headRefRe = (0, regex_1.regEx)(/ref: refs\/heads\/(?<branch>\w+)\s/);
async function getDefaultBranch(subModuleUrl) {
    const val = await (0, simple_git_1.default)((0, config_1.simpleGitConfig)()).listRemote([
        '--symref',
        subModuleUrl,
        'HEAD',
    ]);
    return headRefRe.exec(val)?.groups?.branch ?? 'master';
}
async function getBranch(gitModulesPath, submoduleName, subModuleUrl) {
    return ((await (0, simple_git_1.default)((0, config_1.simpleGitConfig)()).raw([
        'config',
        '--file',
        gitModulesPath,
        '--get',
        `submodule.${submoduleName}.branch`,
    ])) || (await getDefaultBranch(subModuleUrl))).trim();
}
async function getModules(git, gitModulesPath) {
    const res = [];
    try {
        const modules = ((await git.raw([
            'config',
            '--file',
            gitModulesPath,
            '--get-regexp',
            '\\.path',
        ])) ?? /* istanbul ignore next: should never happen */ '')
            .trim()
            .split((0, regex_1.regEx)(/\n/))
            .filter((s) => !!s);
        for (const line of modules) {
            const [, name, path] = line.split((0, regex_1.regEx)(/submodule\.(.+?)\.path\s(.+)/));
            res.push({ name, path });
        }
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.warn({ err }, 'Error getting git submodules during extract');
    }
    return res;
}
async function extractPackageFile(_content, fileName, config) {
    const { localDir } = global_1.GlobalConfig.get();
    const git = (0, simple_git_1.default)(localDir, (0, config_1.simpleGitConfig)());
    const gitModulesPath = upath_1.default.join(localDir, fileName);
    const depNames = await getModules(git, gitModulesPath);
    if (!depNames.length) {
        return null;
    }
    const deps = [];
    for (const { name, path } of depNames) {
        try {
            const [currentDigest] = (await git.subModule(['status', path]))
                .trim()
                .replace((0, regex_1.regEx)(/^[-+]/), '')
                .split((0, regex_1.regEx)(/\s/));
            const subModuleUrl = await getUrl(git, gitModulesPath, name);
            // hostRules only understands HTTP URLs
            // Find HTTP URL, then apply token
            let httpSubModuleUrl = (0, url_2.getHttpUrl)(subModuleUrl);
            httpSubModuleUrl = (0, url_2.getRemoteUrlWithToken)(httpSubModuleUrl);
            const currentValue = await getBranch(gitModulesPath, name, httpSubModuleUrl);
            deps.push({
                depName: path,
                packageName: (0, url_2.getHttpUrl)(subModuleUrl),
                currentValue,
                currentDigest,
            });
        }
        catch (err) /* istanbul ignore next */ {
            logger_1.logger.warn({ err }, 'Error mapping git submodules during extraction');
        }
    }
    return { deps, datasource: git_refs_1.GitRefsDatasource.id };
}
exports.default = extractPackageFile;
//# sourceMappingURL=extract.js.map