"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const js_yaml_1 = require("js-yaml");
const logger_1 = require("../../../logger");
const dart_1 = require("../../datasource/dart");
function getDeps(depsObj, preset) {
    if (!depsObj) {
        return [];
    }
    return Object.keys(depsObj).reduce((acc, depName) => {
        if (depName === 'meta') {
            return acc;
        }
        const section = depsObj[depName];
        let currentValue = null;
        if (section?.version) {
            currentValue = section.version.toString();
        }
        else if (section) {
            if (typeof section === 'string') {
                currentValue = section;
            }
            if (typeof section === 'number') {
                currentValue = section.toString();
            }
        }
        const dep = { ...preset, depName, currentValue };
        return [...acc, dep];
    }, []);
}
function extractPackageFile(content, packageFile) {
    try {
        // TODO: fix me (#9610)
        const doc = (0, js_yaml_1.load)(content, { json: true });
        const deps = [
            ...getDeps(doc.dependencies, {
                depType: 'dependencies',
            }),
            ...getDeps(doc.dev_dependencies, {
                depType: 'dev_dependencies',
            }),
        ];
        if (deps.length) {
            return {
                packageFile,
                datasource: dart_1.DartDatasource.id,
                deps,
            };
        }
    }
    catch (e) {
        logger_1.logger.debug({ packageFile }, 'Can not parse dependency');
    }
    return null;
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map