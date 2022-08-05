"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
function* range(start, end) {
    for (let i = start; i <= end; i += 1) {
        yield i;
    }
    return;
}
exports.range = range;
//# sourceMappingURL=range.js.map