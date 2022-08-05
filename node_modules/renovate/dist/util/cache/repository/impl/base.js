"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoCacheBase = void 0;
class RepoCacheBase {
    constructor() {
        this.data = {};
    }
    // istanbul ignore next
    async load() {
        await Promise.resolve();
    }
    // istanbul ignore next
    async save() {
        await Promise.resolve();
    }
    getData() {
        return this.data;
    }
}
exports.RepoCacheBase = RepoCacheBase;
//# sourceMappingURL=base.js.map