"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleGitConfig = exports.getNoVerify = exports.setNoVerify = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const global_1 = require("../../config/global");
let noVerify = ['push', 'commit'];
function setNoVerify(value) {
    // istanbul ignore if
    if (!is_1.default.array(value, is_1.default.string)) {
        throw new Error('config error: gitNoVerify should be an array of strings');
    }
    noVerify = value;
}
exports.setNoVerify = setNoVerify;
function getNoVerify() {
    return noVerify;
}
exports.getNoVerify = getNoVerify;
function simpleGitConfig() {
    const config = {
        completion: {
            onClose: true,
            onExit: false,
        },
    };
    // https://github.com/steveukx/git-js/pull/591
    const gitTimeout = global_1.GlobalConfig.get('gitTimeout');
    if (is_1.default.number(gitTimeout) && gitTimeout > 0) {
        config.timeout = { block: gitTimeout };
    }
    return config;
}
exports.simpleGitConfig = simpleGitConfig;
//# sourceMappingURL=config.js.map