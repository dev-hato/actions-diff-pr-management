"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const decorator_1 = require("../../decorator");
const packageCache = tslib_1.__importStar(require("."));
/**
 * caches the result of a decorated method.
 */
function cache({ namespace, key, cacheable = () => true, ttlMinutes = 30, }) {
    return (0, decorator_1.decorate)(async ({ args, instance, callback }) => {
        if (!cacheable.apply(instance, args)) {
            return callback();
        }
        let finalNamespace;
        if (is_1.default.string(namespace)) {
            finalNamespace = namespace;
        }
        else if (is_1.default.function_(namespace)) {
            finalNamespace = namespace.apply(instance, args);
        }
        let finalKey;
        if (is_1.default.string(key)) {
            finalKey = key;
        }
        else if (is_1.default.function_(key)) {
            finalKey = key.apply(instance, args);
        }
        // istanbul ignore if
        if (!finalNamespace || !finalKey) {
            return callback();
        }
        const cachedResult = await packageCache.get(finalNamespace, finalKey);
        if (cachedResult !== undefined) {
            return cachedResult;
        }
        const result = await callback();
        // only cache if we got a valid result
        if (result !== undefined) {
            await packageCache.set(finalNamespace, finalKey, result, ttlMinutes);
        }
        return result;
    });
}
exports.cache = cache;
//# sourceMappingURL=decorator.js.map