"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfig = void 0;
class GlobalConfig {
    static get(key) {
        return key ? GlobalConfig.config[key] : GlobalConfig.config;
    }
    static set(config) {
        GlobalConfig.reset();
        const result = { ...config };
        for (const option of GlobalConfig.OPTIONS) {
            GlobalConfig.config[option] = config[option];
            delete result[option];
        }
        return result;
    }
    static reset() {
        GlobalConfig.config = {};
    }
}
exports.GlobalConfig = GlobalConfig;
// TODO: once global config work is complete, add a test to make sure this list includes all options with globalOnly=true (#9603)
GlobalConfig.OPTIONS = [
    'allowCustomCrateRegistries',
    'allowedPostUpgradeCommands',
    'allowPlugins',
    'allowPostUpgradeCommandTemplating',
    'allowScripts',
    'binarySource',
    'cacheDir',
    'customEnvVariables',
    'dockerChildPrefix',
    'dockerImagePrefix',
    'dockerUser',
    'dryRun',
    'exposeAllEnv',
    'executionTimeout',
    'githubTokenWarn',
    'localDir',
    'migratePresets',
    'privateKey',
    'privateKeyOld',
    'gitTimeout',
    'platform',
    'endpoint',
];
GlobalConfig.config = {};
//# sourceMappingURL=global.js.map