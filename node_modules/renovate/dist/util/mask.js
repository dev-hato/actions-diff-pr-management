"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskToken = void 0;
function maskToken(str) {
    return str
        ? [
            str.substring(0, 2),
            new Array(str.length - 3).join('*'),
            str.slice(-2),
        ].join('')
        : '';
}
exports.maskToken = maskToken;
//# sourceMappingURL=mask.js.map