"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterConfig = exports.getManagerConfig = exports.mergeChildConfig = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../logger");
const manager_1 = require("../modules/manager");
const options = tslib_1.__importStar(require("./options"));
const utils_1 = require("./utils");
Object.defineProperty(exports, "mergeChildConfig", { enumerable: true, get: function () { return utils_1.mergeChildConfig; } });
function getManagerConfig(config, manager) {
    let managerConfig = {
        ...config,
        language: null,
        manager,
    };
    const language = (0, manager_1.get)(manager, 'language');
    if (language) {
        // TODO: fix types #7154
        managerConfig = (0, utils_1.mergeChildConfig)(managerConfig, config[language]);
        managerConfig.language = language;
    }
    // TODO: fix types #7154
    managerConfig = (0, utils_1.mergeChildConfig)(managerConfig, config[manager]);
    for (const i of (0, manager_1.getLanguageList)().concat((0, manager_1.getManagerList)())) {
        delete managerConfig[i];
    }
    return managerConfig;
}
exports.getManagerConfig = getManagerConfig;
function filterConfig(inputConfig, targetStage) {
    logger_1.logger.trace({ config: inputConfig }, `filterConfig('${targetStage}')`);
    const outputConfig = { ...inputConfig };
    const stages = [
        'global',
        'repository',
        'package',
        'branch',
        'pr',
    ];
    const targetIndex = stages.indexOf(targetStage);
    for (const option of options.getOptions()) {
        const optionIndex = stages.indexOf(option.stage);
        if (optionIndex !== -1 && optionIndex < targetIndex) {
            delete outputConfig[option.name];
        }
    }
    return outputConfig;
}
exports.filterConfig = filterConfig;
//# sourceMappingURL=index.js.map