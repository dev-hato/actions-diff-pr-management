"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.getDefault = void 0;
const options_1 = require("./options");
const defaultValues = {
    boolean: true,
    array: [],
    string: null,
    object: null,
    integer: null,
};
function getDefault(option) {
    return option.default === undefined
        ? defaultValues[option.type]
        : option.default;
}
exports.getDefault = getDefault;
function getConfig() {
    const options = (0, options_1.getOptions)();
    const config = {};
    options.forEach((option) => {
        if (!option.parent) {
            config[option.name] = getDefault(option);
        }
    });
    return config;
}
exports.getConfig = getConfig;
//# sourceMappingURL=defaults.js.map