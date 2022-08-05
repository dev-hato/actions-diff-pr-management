"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElapsedMinutes = exports.getElapsedDays = void 0;
const ONE_MINUTE_MS = 60 * 1000;
const ONE_DAY_MS = 24 * 60 * ONE_MINUTE_MS;
function getElapsedDays(timestamp) {
    return Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / ONE_DAY_MS);
}
exports.getElapsedDays = getElapsedDays;
function getElapsedMinutes(date) {
    return Math.floor((new Date().getTime() - date.getTime()) / ONE_MINUTE_MS);
}
exports.getElapsedMinutes = getElapsedMinutes;
//# sourceMappingURL=date.js.map