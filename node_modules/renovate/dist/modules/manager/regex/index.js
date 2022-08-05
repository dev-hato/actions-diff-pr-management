"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = exports.supportedDatasources = exports.defaultConfig = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const strategies_1 = require("./strategies");
const utils_1 = require("./utils");
exports.defaultConfig = {
    pinDigests: false,
};
exports.supportedDatasources = ['*'];
function extractPackageFile(content, packageFile, config) {
    let deps;
    switch (config.matchStringsStrategy) {
        default:
        case 'any':
            deps = (0, strategies_1.handleAny)(content, packageFile, config);
            break;
        case 'combination':
            deps = (0, strategies_1.handleCombination)(content, packageFile, config);
            break;
        case 'recursive':
            deps = (0, strategies_1.handleRecursive)(content, packageFile, config);
            break;
    }
    // filter all null values
    deps = deps.filter(is_1.default.truthy);
    if (deps.length) {
        const res = {
            deps,
            matchStrings: config.matchStrings,
        };
        if (config.matchStringsStrategy) {
            res.matchStringsStrategy = config.matchStringsStrategy;
        }
        // copy over templates for autoreplace
        for (const field of utils_1.validMatchFields.map((f) => `${f}Template`)) {
            if (config[field]) {
                res[field] = config[field];
            }
        }
        if (config.autoReplaceStringTemplate) {
            res.autoReplaceStringTemplate = config.autoReplaceStringTemplate;
        }
        return res;
    }
    return null;
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=index.js.map