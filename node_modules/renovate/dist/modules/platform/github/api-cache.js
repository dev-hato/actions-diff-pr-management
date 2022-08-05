"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCache = void 0;
const dequal_1 = require("dequal");
const luxon_1 = require("luxon");
class ApiCache {
    constructor(cache) {
        this.cache = cache;
        this.itemsMapCache = new WeakMap();
    }
    get etag() {
        return this.cache.etag ?? null;
    }
    set etag(value) {
        if (value === null) {
            delete this.cache.etag;
        }
        else {
            this.cache.etag = value;
        }
    }
    /**
     * @returns Date formatted to use in HTTP headers
     */
    get lastModified() {
        const { lastModified } = this.cache;
        return lastModified ? luxon_1.DateTime.fromISO(lastModified).toHTTP() : null;
    }
    getItems(mapFn) {
        if (mapFn) {
            const cachedResult = this.itemsMapCache.get(mapFn);
            if (cachedResult) {
                return cachedResult;
            }
            const items = Object.values(this.cache.items);
            const mappedResult = items.map(mapFn);
            this.itemsMapCache.set(mapFn, mappedResult);
            return mappedResult;
        }
        const items = Object.values(this.cache.items);
        return items;
    }
    getItem(number) {
        return this.cache.items[number] ?? null;
    }
    /**
     * It intentionally doesn't alter `lastModified` cache field.
     *
     * The point is to allow cache modifications during run, but
     * force fetching and refreshing of modified items next run.
     */
    updateItem(item) {
        this.cache.items[item.number] = item;
        this.itemsMapCache = new WeakMap();
    }
    /**
     * Copies items from `page` to `cache`.
     * Updates internal cache timestamp.
     *
     * @param cache Cache object
     * @param page List of cacheable items, sorted by `updated_at` field
     * starting from the most recently updated.
     * @returns `true` when the next page is likely to contain fresh items,
     * otherwise `false`.
     */
    reconcile(page) {
        const { items } = this.cache;
        let { lastModified } = this.cache;
        let needNextPage = true;
        for (const newItem of page) {
            const number = newItem.number;
            const oldItem = items[number];
            const itemNewTime = luxon_1.DateTime.fromISO(newItem.updated_at);
            const itemOldTime = oldItem?.updated_at
                ? luxon_1.DateTime.fromISO(oldItem.updated_at)
                : null;
            if (!(0, dequal_1.dequal)(oldItem, newItem)) {
                items[number] = newItem;
                this.itemsMapCache = new WeakMap();
            }
            needNextPage = itemOldTime ? itemOldTime < itemNewTime : true;
            const cacheOldTime = lastModified ? luxon_1.DateTime.fromISO(lastModified) : null;
            if (!cacheOldTime || itemNewTime > cacheOldTime) {
                lastModified = newItem.updated_at;
            }
        }
        this.cache.lastModified = lastModified;
        return needNextPage;
    }
}
exports.ApiCache = ApiCache;
//# sourceMappingURL=api-cache.js.map