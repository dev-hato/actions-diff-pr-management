"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruby_semver_1 = require("@renovatebot/ruby-semver");
const logger_1 = require("../../../../logger");
const operator_1 = require("../operator");
const range_1 = require("../range");
const version_1 = require("../version");
exports.default = ({ range, to }) => {
    const ranges = range.split(',').map(range_1.parse);
    const results = ranges.map(({ operator, version: ver, delimiter }) => {
        switch (operator) {
            case operator_1.GT:
                return (0, ruby_semver_1.lte)(to, ver)
                    ? `${operator_1.GT}${delimiter}${ver}`
                    : `${operator_1.GT}${delimiter}${(0, version_1.decrement)(to)}`;
            case operator_1.LT:
                return (0, ruby_semver_1.gte)(to, ver)
                    ? `${operator_1.LT}${delimiter}${(0, version_1.increment)(ver, to)}`
                    : `${operator_1.LT}${delimiter}${ver}`;
            case operator_1.PGTE:
                return `${operator}${delimiter}${(0, version_1.floor)(to)}`;
            case operator_1.GTE:
            case operator_1.LTE:
            case operator_1.EQUAL:
                return `${operator}${delimiter}${to}`;
            case operator_1.NOT_EQUAL:
                return `${operator_1.NOT_EQUAL}${delimiter}${ver}`;
            // istanbul ignore next
            default:
                logger_1.logger.warn(`Unsupported operator '${operator}'`);
                return null;
        }
    });
    return results.join(', ');
};
//# sourceMappingURL=bump.js.map