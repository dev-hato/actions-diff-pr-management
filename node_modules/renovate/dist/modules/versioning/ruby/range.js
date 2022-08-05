"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ltr = exports.parse = void 0;
const requirement_js_1 = require("@renovatebot/ruby-semver/dist/ruby/requirement.js");
const version_js_1 = require("@renovatebot/ruby-semver/dist/ruby/version.js");
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const operator_1 = require("./operator");
const parse = (range) => {
    const regExp = (0, regex_1.regEx)(/^(?<operator>[^\d\s]+)?(?<delimiter>\s*)(?<version>[0-9a-zA-Z-.]+)$/);
    const value = (range || '').trim();
    const match = regExp.exec(value);
    if (match?.groups) {
        const { version = '', operator = '', delimiter = ' ' } = match.groups;
        return { version, operator, delimiter };
    }
    return {
        version: '',
        operator: '',
        delimiter: ' ',
    };
};
exports.parse = parse;
const ltr = (version, range) => {
    const gemVersion = (0, version_js_1.create)(version);
    if (!gemVersion) {
        logger_1.logger.warn(`Invalid ruby version '${version}'`);
        return false;
    }
    const requirements = range.split(',').map(requirement_js_1.parse);
    const results = requirements.map(([operator, ver]) => {
        switch (operator) {
            case operator_1.GT:
            case operator_1.LT:
                return gemVersion.compare(ver) <= 0;
            case operator_1.GTE:
            case operator_1.LTE:
            case operator_1.EQUAL:
            case operator_1.NOT_EQUAL:
                return gemVersion.compare(ver) < 0;
            case operator_1.PGTE:
                return (gemVersion.compare(ver) < 0 &&
                    gemVersion.release().compare(ver.bump()) <= 0);
            // istanbul ignore next
            default:
                logger_1.logger.warn(`Unsupported operator '${operator}'`);
                return false;
        }
    });
    return results.reduce((accumulator, value) => accumulator && value, true);
};
exports.ltr = ltr;
//# sourceMappingURL=range.js.map