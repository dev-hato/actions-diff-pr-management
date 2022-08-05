"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configRegexPredicate = exports.isConfigRegex = exports.newlineRegex = exports.escapeRegExp = exports.regEx = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const error_messages_1 = require("../constants/error-messages");
const expose_cjs_1 = require("../expose.cjs");
const logger_1 = require("../logger");
let RegEx;
const cache = new Map();
try {
    const RE2 = (0, expose_cjs_1.re2)();
    // Test if native is working
    new RE2('.*').exec('test');
    logger_1.logger.debug('Using RE2 as regex engine');
    RegEx = RE2;
}
catch (err) {
    logger_1.logger.warn({ err }, 'RE2 not usable, falling back to RegExp');
    RegEx = RegExp;
}
function regEx(pattern, flags, useCache = true) {
    const key = flags ? `${pattern.toString()}:${flags}` : pattern.toString();
    if (useCache) {
        const cachedResult = cache.get(key);
        if (cachedResult) {
            return cachedResult;
        }
    }
    try {
        const instance = new RegEx(pattern, flags);
        if (useCache) {
            cache.set(key, instance);
        }
        return instance;
    }
    catch (err) {
        const error = new Error(error_messages_1.CONFIG_VALIDATION);
        error.validationSource = pattern.toString();
        error.validationError = `Invalid regular expression: ${pattern.toString()}`;
        throw error;
    }
}
exports.regEx = regEx;
function escapeRegExp(input) {
    return input.replace(regEx(/[.*+\-?^${}()|[\]\\]/g), '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
exports.newlineRegex = regEx(/\r?\n/);
const configValStart = regEx(/^!?\//);
const configValEnd = regEx(/\/$/);
function isConfigRegex(input) {
    return (is_1.default.string(input) && configValStart.test(input) && configValEnd.test(input));
}
exports.isConfigRegex = isConfigRegex;
function parseConfigRegex(input) {
    try {
        const regexString = input
            .replace(configValStart, '')
            .replace(configValEnd, '');
        return regEx(regexString);
    }
    catch (err) {
        // no-op
    }
    return null;
}
function configRegexPredicate(input) {
    if (isConfigRegex(input)) {
        const configRegex = parseConfigRegex(input);
        if (configRegex) {
            const isPositive = !input.startsWith('!');
            return (x) => {
                const res = configRegex.test(x);
                return isPositive ? res : !res;
            };
        }
    }
    return null;
}
exports.configRegexPredicate = configRegexPredicate;
//# sourceMappingURL=regex.js.map