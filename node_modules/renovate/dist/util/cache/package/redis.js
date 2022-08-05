"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.set = exports.get = exports.end = void 0;
/* istanbul ignore file */
const luxon_1 = require("luxon");
const redis_1 = require("redis");
const logger_1 = require("../../../logger");
let client;
function getKey(namespace, key) {
    return `${namespace}-${key}`;
}
async function end() {
    try {
        // https://github.com/redis/node-redis#disconnecting
        await client?.disconnect();
    }
    catch (err) {
        logger_1.logger.warn({ err }, 'Redis cache end failed');
    }
}
exports.end = end;
async function rm(namespace, key) {
    logger_1.logger.trace({ namespace, key }, 'Removing cache entry');
    await client?.del(getKey(namespace, key));
}
async function get(namespace, key) {
    if (!client) {
        return undefined;
    }
    logger_1.logger.trace(`cache.get(${namespace}, ${key})`);
    try {
        const res = await client?.get(getKey(namespace, key));
        const cachedValue = res && JSON.parse(res);
        if (cachedValue) {
            if (luxon_1.DateTime.local() < luxon_1.DateTime.fromISO(cachedValue.expiry)) {
                logger_1.logger.trace({ namespace, key }, 'Returning cached value');
                return cachedValue.value;
            }
            // istanbul ignore next
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
    logger_1.logger.trace({ namespace, key, ttlMinutes }, 'Saving cached value');
    // Redis requires TTL to be integer, not float
    const redisTTL = Math.floor(ttlMinutes * 60);
    await client?.set(getKey(namespace, key), JSON.stringify({
        value,
        expiry: luxon_1.DateTime.local().plus({ minutes: ttlMinutes }),
    }), { EX: redisTTL });
}
exports.set = set;
async function init(url) {
    if (!url) {
        return;
    }
    logger_1.logger.debug('Redis cache init');
    client = (0, redis_1.createClient)({
        url,
        socket: {
            reconnectStrategy: (retries) => {
                // Reconnect after this time
                return Math.min(retries * 100, 3000);
            },
        },
    });
    await client.connect();
}
exports.init = init;
//# sourceMappingURL=redis.js.map