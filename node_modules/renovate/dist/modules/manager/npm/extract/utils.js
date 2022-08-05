"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesAnyPattern = void 0;
const tslib_1 = require("tslib");
const minimatch_1 = tslib_1.__importDefault(require("minimatch"));
const logger_1 = require("../../../../logger");
function matchesAnyPattern(val, patterns) {
    const res = patterns.some((pattern) => pattern === val + '/' || (0, minimatch_1.default)(val, pattern, { dot: true }));
    logger_1.logger.trace({ val, patterns, res }, `matchesAnyPattern`);
    return res;
}
exports.matchesAnyPattern = matchesAnyPattern;
//# sourceMappingURL=utils.js.map