"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const js_yaml_1 = require("js-yaml");
const logger_1 = require("../../../logger");
const extract_1 = require("../dockerfile/extract");
function extractPackageFile(file) {
    let doc;
    try {
        doc = (0, js_yaml_1.load)(file, { json: true });
    }
    catch (err) {
        logger_1.logger.debug({ err, file }, 'Failed to parse Vela file.');
        return null;
    }
    const deps = [];
    // iterate over steps
    for (const step of doc.steps ?? []) {
        const dep = (0, extract_1.getDep)(step.image);
        deps.push(dep);
    }
    // iterate over services
    for (const service of doc.services ?? []) {
        const dep = (0, extract_1.getDep)(service.image);
        deps.push(dep);
    }
    // iterate over stages
    for (const stage of Object.values(doc.stages ?? {})) {
        for (const step of stage.steps ?? []) {
            const dep = (0, extract_1.getDep)(step.image);
            deps.push(dep);
        }
    }
    // check secrets
    for (const secret of Object.values(doc.secrets ?? {})) {
        if (secret.origin) {
            const dep = (0, extract_1.getDep)(secret.origin.image);
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