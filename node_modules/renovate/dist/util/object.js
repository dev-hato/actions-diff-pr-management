"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasKey = void 0;
/**
 * This is a workaround helper to allow the usage of 'unknown' in
 * a type-guard function while checking that keys exist.
 *
 * @see https://github.com/microsoft/TypeScript/issues/21732
 * @see https://stackoverflow.com/a/58630274
 */
function hasKey(k, o) {
    return typeof o === 'object' && k in o;
}
exports.hasKey = hasKey;
//# sourceMappingURL=object.js.map