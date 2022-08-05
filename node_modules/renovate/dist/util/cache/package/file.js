"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.set = exports.get = void 0;
const tslib_1 = require("tslib");
const cacache_1 = tslib_1.__importDefault(require("cacache"));
const luxon_1 = require("luxon");
const upath_1 = tslib_1.__importDefault(require("upath"));
const logger_1 = require("../../../logger");
function getKey(namespace, key) {
    return `${namespace}-${key}`;
}
let cacheFileName;
async function rm(namespace, key) {
    logger_1.logger.trace({ namespace, key }, 'Removing cache entry');
    await cacache_1.default.rm.entry(cacheFileName, getKey(namespace, key));
}
async function get(namespace, key) {
    if (!cacheFileName) {
        return undefined;
    }
    try {
        const res = await cacache_1.default.get(cacheFileName, getKey(namespace, key));
        const cachedValue = JSON.parse(res.data.toString());
        if (cachedValue) {
            if (luxon_1.DateTime.local() < luxon_1.DateTime.fromISO(cachedValue.expiry)) {
                logger_1.logger.trace({ namespace, key }, 'Returning cached value');
                return cachedValue.value;
            }
            await rm(namespace, key);
        }
    }
    catch (err) {
        logger_1.logger.trace({ namespace, key }, 'Cache miss');
    }
    return undefined;
}
exports.get = get;
async function set(namespace, key, value, ttlMinutes = 5) {
    if (!cacheFileName) {
        return;
    }
    logger_1.logger.trace({ namespace, key, ttlMinutes }, 'Saving cached value');
    await cacache_1.default.put(cacheFileName, getKey(namespace, key), JSON.stringify({
        value,
        expiry: luxon_1.DateTime.local().plus({ minutes: ttlMinutes }),
    }));
}
exports.set = set;
function init(cacheDir) {
    cacheFileName = upath_1.default.join(cacheDir, '/renovate/renovate-cache-v1');
    logger_1.logger.debug('Initializing Renovate internal cache into ' + cacheFileName);
}
exports.init = init;
//# sourceMappingURL=file.js.map