"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const gitUrl = (0, regex_1.regEx)(/(ssh:\/\/git@|https:\/\/)([\w.]+)\/([\w:/\-~]*)\/(?<depName>[\w:/-]+)(\.git)?/);
function extractPackageFile(content, packageFile) {
    logger_1.logger.trace({ packageFile }, 'jsonnet-bundler.extractPackageFile()');
    if (packageFile.match(/vendor\//)) {
        return null;
    }
    const deps = [];
    let jsonnetFile;
    try {
        jsonnetFile = JSON.parse(content);
    }
    catch (err) {
        logger_1.logger.debug({ packageFile }, 'Invalid JSON');
        return null;
    }
    for (const dependency of jsonnetFile.dependencies ?? []) {
        const dep = extractDependency(dependency);
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
function extractDependency(dependency) {
    if (!dependency.source.git) {
        return null;
    }
    const match = gitUrl.exec(dependency.source.git.remote);
    return {
        depName: dependency.name ?? match?.groups?.depName ?? dependency.source.git.remote,
        packageName: dependency.source.git.remote,
        currentValue: dependency.version,
        managerData: { subdir: dependency.source.git.subdir },
    };
}
//# sourceMappingURL=extract.js.map