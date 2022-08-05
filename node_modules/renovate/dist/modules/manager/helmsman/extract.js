"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const js_yaml_1 = require("js-yaml");
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const helm_1 = require("../../datasource/helm");
const chartRegex = (0, regex_1.regEx)('^(?<registryRef>[^/]*)/(?<packageName>[^/]*)$');
function createDep(key, doc) {
    const dep = {
        depName: key,
        datasource: helm_1.HelmDatasource.id,
    };
    const anApp = doc.apps[key];
    if (!anApp) {
        return null;
    }
    if (!anApp.version) {
        dep.skipReason = 'no-version';
        return dep;
    }
    dep.currentValue = anApp.version;
    const regexResult = anApp.chart ? chartRegex.exec(anApp.chart) : null;
    if (!regexResult?.groups) {
        dep.skipReason = 'invalid-url';
        return dep;
    }
    if (!is_1.default.nonEmptyString(regexResult.groups.packageName)) {
        dep.skipReason = 'invalid-name';
        return dep;
    }
    dep.packageName = regexResult.groups.packageName;
    const registryUrl = doc.helmRepos[regexResult.groups.registryRef];
    if (!is_1.default.nonEmptyString(registryUrl)) {
        dep.skipReason = 'no-repository';
        return dep;
    }
    dep.registryUrls = [registryUrl];
    return dep;
}
function extractPackageFile(content, fileName, config) {
    try {
        // TODO: fix me (#9610)
        const doc = (0, js_yaml_1.load)(content, {
            json: true,
        });
        if (!(doc?.helmRepos && doc.apps)) {
            logger_1.logger.debug({ fileName }, 'Missing helmRepos and/or apps keys');
            return null;
        }
        const deps = Object.keys(doc.apps)
            .map((key) => createDep(key, doc))
            .filter(is_1.default.truthy); // filter null values
        if (deps.length === 0) {
            return null;
        }
        return { deps };
    }
    catch (err) /* istanbul ignore next */ {
        if (err.stack?.startsWith('YAMLException:')) {
            logger_1.logger.debug({ err }, 'YAML exception extracting');
        }
        else {
            logger_1.logger.warn({ err }, 'Error extracting');
        }
        return null;
    }
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map