"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
const tslib_1 = require("tslib");
const fast_safe_stringify_1 = tslib_1.__importDefault(require("fast-safe-stringify"));
function clone(input = null) {
    return JSON.parse((0, fast_safe_stringify_1.default)(input));
}
exports.clone = clone;
//# sourceMappingURL=clone.js.map