"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSplits = exports.addSplit = exports.splitInit = void 0;
let startTime = 0;
let lastTime = 0;
let splits = {};
function splitInit() {
    splits = {};
    startTime = Date.now();
    lastTime = startTime;
}
exports.splitInit = splitInit;
function addSplit(name) {
    splits[name] = Date.now() - lastTime;
    lastTime = Date.now();
}
exports.addSplit = addSplit;
function getSplits() {
    return { splits, total: Date.now() - startTime };
}
exports.getSplits = getSplits;
//# sourceMappingURL=split.js.map