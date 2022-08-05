"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeStrategy = void 0;
function getRangeStrategy(config) {
    if (config.rangeStrategy === 'auto') {
        return 'pin';
    }
    return config.rangeStrategy;
}
exports.getRangeStrategy = getRangeStrategy;
//# sourceMappingURL=range.js.map