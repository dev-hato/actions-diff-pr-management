"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = exports.reset = exports.init = void 0;
let repoCache;
function init() {
    repoCache = {};
}
exports.init = init;
function reset() {
    repoCache = undefined;
}
exports.reset = reset;
function get(key) {
    return repoCache?.[key];
}
exports.get = get;
function set(key, value) {
    if (repoCache) {
        repoCache[key] = value;
    }
}
exports.set = set;
//# sourceMappingURL=index.js.map