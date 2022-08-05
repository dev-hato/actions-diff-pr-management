"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRepoCache = void 0;
const global_1 = require("../../../config/global");
const local_1 = require("./impl/local");
const _1 = require(".");
/**
 * Extracted to separate file in order to avoid circular module dependencies.
 */
async function initRepoCache(config) {
    (0, _1.resetCache)();
    const { platform } = global_1.GlobalConfig.get();
    const { repository, repositoryCache } = config;
    if (repositoryCache === 'disabled' || !platform || !repository) {
        return;
    }
    if (repositoryCache === 'enabled') {
        const localCache = new local_1.LocalRepoCache(platform, repository);
        await localCache.load();
        (0, _1.setCache)(localCache);
        return;
    }
    if (repositoryCache === 'reset') {
        const localCache = new local_1.LocalRepoCache(platform, repository);
        await localCache.save();
        (0, _1.setCache)(localCache);
        return;
    }
}
exports.initRepoCache = initRepoCache;
//# sourceMappingURL=init.js.map