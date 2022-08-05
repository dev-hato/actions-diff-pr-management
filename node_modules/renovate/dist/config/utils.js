"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeChildConfig = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../logger");
const clone_1 = require("../util/clone");
const options = tslib_1.__importStar(require("./options"));
function mergeChildConfig(parent, child) {
    logger_1.logger.trace({ parent, child }, `mergeChildConfig`);
    if (!child) {
        return parent;
    }
    const parentConfig = (0, clone_1.clone)(parent);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const childConfig = (0, clone_1.clone)(child);
    const config = { ...parentConfig, ...childConfig };
    for (const option of options.getOptions()) {
        if (option.mergeable &&
            childConfig[option.name] &&
            parentConfig[option.name]) {
            logger_1.logger.trace(`mergeable option: ${option.name}`);
            if (option.name === 'constraints') {
                config[option.name] = {
                    ...parentConfig[option.name],
                    ...childConfig[option.name],
                };
            }
            else if (option.type === 'array') {
                config[option.name] = parentConfig[option.name].concat(config[option.name]);
            }
            else {
                config[option.name] = mergeChildConfig(parentConfig[option.name], childConfig[option.name]);
            }
            logger_1.logger.trace({ result: config[option.name] }, `Merged config.${option.name}`);
        }
    }
    return { ...config, ...config.force };
}
exports.mergeChildConfig = mergeChildConfig;
//# sourceMappingURL=utils.js.map