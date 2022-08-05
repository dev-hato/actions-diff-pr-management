"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCache = exports.getCache = exports.setCache = exports.resetCache = void 0;
const base_1 = require("./impl/base");
let repoCache = new base_1.RepoCacheBase();
function resetCache() {
    setCache(new base_1.RepoCacheBase());
}
exports.resetCache = resetCache;
function setCache(cache) {
    repoCache = cache;
}
exports.setCache = setCache;
function getCache() {
    return repoCache.getData();
}
exports.getCache = getCache;
async function saveCache() {
    await repoCache.save();
}
exports.saveCache = saveCache;
//# sourceMappingURL=index.js.map