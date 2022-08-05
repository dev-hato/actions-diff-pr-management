"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCaches = exports.resetCaches = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const npmApi = tslib_1.__importStar(require("../../../modules/datasource/npm"));
const memCache = tslib_1.__importStar(require("../../../util/cache/memory"));
const repositoryCache = tslib_1.__importStar(require("../../../util/cache/repository"));
const init_1 = require("../../../util/cache/repository/init");
const fs_1 = require("../../../util/fs");
async function resetCaches() {
    memCache.reset();
    repositoryCache.resetCache();
    await fs_extra_1.default.remove((0, fs_1.privateCacheDir)());
    npmApi.resetMemCache();
}
exports.resetCaches = resetCaches;
async function initializeCaches(config) {
    memCache.init();
    await (0, init_1.initRepoCache)(config);
    await fs_extra_1.default.ensureDir((0, fs_1.privateCacheDir)());
    npmApi.setNpmrc(config.npmrc);
}
exports.initializeCaches = initializeCaches;
//# sourceMappingURL=cache.js.map