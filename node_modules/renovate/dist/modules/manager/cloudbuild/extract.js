"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const js_yaml_1 = require("js-yaml");
const logger_1 = require("../../../logger");
const extract_1 = require("../dockerfile/extract");
function extractPackageFile(content) {
    const deps = [];
    try {
        // TODO: fix types
        const doc = (0, js_yaml_1.load)(content);
        if (doc?.steps && is_1.default.array(doc.steps)) {
            for (const step of doc.steps) {
                if (step.name) {
                    const dep = (0, extract_1.getDep)(step.name);
                    logger_1.logger.trace({
                        depName: dep.depName,
                        currentValue: dep.currentValue,
                        currentDigest: dep.currentDigest,
                    }, 'Cloud Build docker image');
                    deps.push(dep);
                }
            }
        }
    }
    catch (err) /* istanbul ignore next */ {
        if (err.stack?.startsWith('YAMLException:')) {
            logger_1.logger.debug({ err }, 'YAML exception extracting Docker images from a Cloud Build configuration file.');
        }
        else {
            logger_1.logger.warn({ err }, 'Error extracting Docker images from a Cloud Build configuration file.');
        }
    }
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map