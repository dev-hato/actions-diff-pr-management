"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = void 0;
function memoize(callback) {
    let memo = null;
    return () => {
        if (memo) {
            return memo.res;
        }
        const res = callback();
        memo = { res };
        return res;
    };
}
exports.memoize = memoize;
//# sourceMappingURL=memoize.js.map