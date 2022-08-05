"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const js_yaml_1 = require("js-yaml");
const logger_1 = require("../../../logger");
const github_tags_1 = require("../../datasource/github-tags");
function extractPackageFile(content) {
    let doc;
    try {
        doc = (0, js_yaml_1.load)(content, {
            json: true,
        });
    }
    catch (err) {
        logger_1.logger.warn({ err, content }, 'Failed to parse .travis.yml file.');
        return null;
    }
    let deps = [];
    if (doc && is_1.default.array(doc.node_js)) {
        deps = doc.node_js.map((currentValue) => ({
            depName: 'node',
            datasource: github_tags_1.GithubTagsDatasource.id,
            packageName: 'nodejs/node',
            currentValue: currentValue.toString(),
        }));
    }
    // Handle the matrix syntax
    let matrix_include;
    if (doc?.jobs?.include) {
        matrix_include = doc.jobs.include;
    }
    else if (doc?.matrix?.include) {
        matrix_include = doc.matrix.include;
    }
    if (!is_1.default.array(matrix_include)) {
        return deps.length ? { deps } : null;
    }
    for (const item of matrix_include) {
        if (item?.node_js) {
            if (is_1.default.array(item.node_js)) {
                item.node_js.forEach((currentValue) => {
                    deps.push({
                        depName: 'node',
                        datasource: github_tags_1.GithubTagsDatasource.id,
                        packageName: 'nodejs/node',
                        currentValue: currentValue.toString(),
                    });
                });
            }
            else if (is_1.default.string(item.node_js)) {
                deps.push({
                    depName: 'node',
                    datasource: github_tags_1.GithubTagsDatasource.id,
                    packageName: 'nodejs/node',
                    currentValue: item.node_js.toString(),
                });
            }
        }
    }
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map