"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const js_yaml_1 = require("js-yaml");
const global_1 = require("../../../config/global");
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const gitlab_tags_1 = require("../../datasource/gitlab-tags");
const utils_1 = require("../gitlabci/utils");
function extractDepFromIncludeFile(includeObj) {
    const dep = {
        datasource: gitlab_tags_1.GitlabTagsDatasource.id,
        depName: includeObj.project,
        depType: 'repository',
    };
    if (!includeObj.ref) {
        dep.skipReason = 'unknown-version';
        return dep;
    }
    dep.currentValue = includeObj.ref;
    return dep;
}
function extractPackageFile(content) {
    const deps = [];
    const { platform, endpoint } = global_1.GlobalConfig.get();
    try {
        // TODO: fix me (#9610)
        const doc = (0, js_yaml_1.load)((0, utils_1.replaceReferenceTags)(content), {
            json: true,
        });
        let includes;
        if (doc?.include && is_1.default.array(doc.include)) {
            includes = doc.include;
        }
        else {
            includes = [doc.include];
        }
        for (const includeObj of includes) {
            if (includeObj?.file && includeObj.project) {
                const dep = extractDepFromIncludeFile(includeObj);
                if (platform === 'gitlab' && endpoint) {
                    dep.registryUrls = [endpoint.replace((0, regex_1.regEx)(/\/api\/v4\/?/), '')];
                }
                deps.push(dep);
            }
        }
    }
    catch (err) /* istanbul ignore next */ {
        if (err.stack?.startsWith('YAMLException:')) {
            logger_1.logger.debug({ err }, 'YAML exception extracting GitLab CI includes');
        }
        else {
            logger_1.logger.warn({ err }, 'Error extracting GitLab CI includes');
        }
    }
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map