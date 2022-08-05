"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeStrategy = exports.extractPackageFile = exports.extractAllPackageFiles = exports.detectAllGlobalConfig = exports.getManagers = exports.getManagerList = exports.getLanguageList = exports.get = exports.hashMap = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../constants");
const api_1 = tslib_1.__importDefault(require("./api"));
var fingerprint_generated_1 = require("./fingerprint.generated");
Object.defineProperty(exports, "hashMap", { enumerable: true, get: function () { return fingerprint_generated_1.hashMap; } });
const managerList = Array.from(api_1.default.keys());
const languageList = Object.values(constants_1.ProgrammingLanguage);
function get(manager, name) {
    return api_1.default.get(manager)?.[name];
}
exports.get = get;
const getLanguageList = () => languageList;
exports.getLanguageList = getLanguageList;
const getManagerList = () => managerList;
exports.getManagerList = getManagerList;
const getManagers = () => api_1.default;
exports.getManagers = getManagers;
async function detectAllGlobalConfig() {
    let config = {};
    for (const managerName of managerList) {
        const manager = api_1.default.get(managerName);
        if (manager.detectGlobalConfig) {
            // This should use mergeChildConfig once more than one manager is supported, but introduces a cyclic dependency
            config = { ...config, ...(await manager.detectGlobalConfig()) };
        }
    }
    return config;
}
exports.detectAllGlobalConfig = detectAllGlobalConfig;
async function extractAllPackageFiles(manager, config, files) {
    if (!api_1.default.has(manager)) {
        return null;
    }
    const m = api_1.default.get(manager);
    if (m.extractAllPackageFiles) {
        const res = await m.extractAllPackageFiles(config, files);
        // istanbul ignore if
        if (!res) {
            return null;
        }
        return res;
    }
    return null;
}
exports.extractAllPackageFiles = extractAllPackageFiles;
function extractPackageFile(manager, content, fileName, config) {
    if (!api_1.default.has(manager)) {
        return null;
    }
    const m = api_1.default.get(manager);
    return m.extractPackageFile
        ? m.extractPackageFile(content, fileName, config)
        : null;
}
exports.extractPackageFile = extractPackageFile;
function getRangeStrategy(config) {
    const { manager, rangeStrategy } = config;
    if (!manager || !api_1.default.has(manager)) {
        return null;
    }
    const m = api_1.default.get(manager);
    if (m.getRangeStrategy) {
        // Use manager's own function if it exists
        const managerRangeStrategy = m.getRangeStrategy(config);
        if (managerRangeStrategy === 'in-range-only') {
            return 'update-lockfile';
        }
        return managerRangeStrategy;
    }
    if (rangeStrategy === 'auto') {
        // default to 'replace' for auto
        return 'replace';
    }
    if (rangeStrategy === 'in-range-only') {
        return 'update-lockfile';
    }
    return config.rangeStrategy;
}
exports.getRangeStrategy = getRangeStrategy;
//# sourceMappingURL=index.js.map