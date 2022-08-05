"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeStrategy = void 0;
function getRangeStrategy(config) {
    return !config.rangeStrategy || config.rangeStrategy === 'auto'
        ? 'replace'
        : config.rangeStrategy;
}
exports.getRangeStrategy = getRangeStrategy;
//# sourceMappingURL=range.js.map