"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
/**
 * Applies decorating function to intercept decorated method calls.
 * @param fn - The decorating function.
 */
function decorate(fn) {
    const result = (target, key, 
    /* TODO: Can descriptor be undefined ? */
    descriptor = Object.getOwnPropertyDescriptor(target, key) ?? {
        enumerable: true,
        configurable: true,
        writable: true,
    }) => {
        const { value } = descriptor;
        return Object.assign(descriptor, {
            value(...args) {
                return fn({
                    args,
                    instance: this,
                    callback: () => value?.apply(this, args),
                });
            },
        });
    };
    return result;
}
exports.decorate = decorate;
//# sourceMappingURL=index.js.map