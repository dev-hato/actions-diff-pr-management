"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = exports.init = exports.set = exports.get = void 0;
const tslib_1 = require("tslib");
const memCache = tslib_1.__importStar(require("../memory"));
const fileCache = tslib_1.__importStar(require("./file"));
const redisCache = tslib_1.__importStar(require("./redis"));
let cacheProxy;
function getGlobalKey(namespace, key) {
    return `global%%${namespace}%%${key}`;
}
async function get(namespace, key) {
    if (!cacheProxy) {
        return undefined;
    }
    const globalKey = getGlobalKey(namespace, key);
    if (memCache.get(globalKey) === undefined) {
        memCache.set(globalKey, cacheProxy.get(namespace, key));
    }
    const result = await memCache.get(globalKey);
    return result;
}
exports.get = get;
async function set(namespace, key, value, minutes) {
    if (!cacheProxy) {
        return;
    }
    const globalKey = getGlobalKey(namespace, key);
    memCache.set(globalKey, value);
    await cacheProxy.set(namespace, key, value, minutes);
}
exports.set = set;
async function init(config) {
    if (config.redisUrl) {
        await redisCache.init(config.redisUrl);
        cacheProxy = {
            get: redisCache.get,
            set: redisCache.set,
        };
    }
    else if (config.cacheDir) {
        fileCache.init(config.cacheDir);
        cacheProxy = {
            get: fileCache.get,
            set: fileCache.set,
        };
    }
}
exports.init = init;
async function cleanup(config) {
    if (config?.redisUrl) {
        await redisCache.end();
    }
}
exports.cleanup = cleanup;
//# sourceMappingURL=index.js.map