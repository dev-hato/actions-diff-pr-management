"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrCache = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const constants_1 = require("../../../constants");
const logger_1 = require("../../../logger");
const external_host_error_1 = require("../../../types/errors/external-host-error");
const repository_1 = require("../../../util/cache/repository");
const url_1 = require("../../../util/url");
const pr_body_1 = require("../pr-body");
const api_cache_1 = require("./api-cache");
const common_1 = require("./common");
function removeUrlFields(input) {
    if (is_1.default.plainObject(input)) {
        for (const [key, val] of Object.entries(input)) {
            if ((key === 'url' || key.endsWith('_url')) && is_1.default.string(val)) {
                delete input[key];
            }
            else {
                removeUrlFields(val);
            }
        }
    }
}
function compactPrBodyStructure(input) {
    if (is_1.default.plainObject(input)) {
        if (!input.bodyStruct && is_1.default.string(input.body)) {
            input.bodyStruct = (0, pr_body_1.getPrBodyStruct)(input.body);
            delete input.body;
        }
    }
}
function massageGhRestPr(ghPr) {
    removeUrlFields(ghPr);
    delete ghPr.head?.repo?.pushed_at;
    delete ghPr.base?.repo?.pushed_at;
    delete ghPr._links;
    compactPrBodyStructure(ghPr);
    return ghPr;
}
function getPrApiCache() {
    var _a, _b;
    const repoCache = (0, repository_1.getCache)();
    repoCache.platform ?? (repoCache.platform = {});
    (_a = repoCache.platform).github ?? (_a.github = {});
    (_b = repoCache.platform.github).prCache ?? (_b.prCache = { items: {} });
    const apiPageCache = repoCache.platform.github
        .prCache;
    const items = Object.values(apiPageCache.items);
    const firstItem = items?.[0];
    if (firstItem?.body) {
        apiPageCache.items = {};
    }
    else if (firstItem?._links) {
        for (const ghPr of items) {
            massageGhRestPr(ghPr);
        }
    }
    const prCache = new api_cache_1.ApiCache(apiPageCache);
    return prCache;
}
/**
 *  Fetch and return Pull Requests from GitHub repository:
 *
 *   1. Synchronize long-term cache.
 *
 *   2. Store items in raw format, i.e. exactly what
 *      has been returned by GitHub REST API.
 *
 *   3. Convert items to the Renovate format and return.
 *
 * In order synchronize ApiCache properly, we handle 3 cases:
 *
 *   a. We never fetched PR list for this repo before.
 *      If cached PR list is empty, we assume it's the case.
 *
 *      In this case, we're falling back to quick fetch via
 *      `paginate=true` option (see `util/http/github.ts`).
 *
 *   b. Some of PRs had changed since last run.
 *
 *      In this case, we sequentially fetch page by page
 *      until `ApiCache.coerce` function indicates that
 *      no more fresh items can be found in the next page.
 *
 *      We expect to fetch just one page per run in average,
 *      since it's rare to have more than 100 updated PRs.
 */
async function getPrCache(http, repo, username) {
    const prCache = {};
    const prApiCache = getPrApiCache();
    const isInitial = is_1.default.emptyArray(prApiCache.getItems());
    try {
        let requestsTotal = 0;
        let apiQuotaAffected = false;
        let needNextPageFetch = true;
        let needNextPageSync = true;
        let pageIdx = 1;
        while (needNextPageFetch && needNextPageSync) {
            const opts = { paginate: false };
            if (pageIdx === 1 && isInitial) {
                // Speed up initial fetch
                opts.paginate = true;
            }
            const perPage = isInitial ? 100 : 20;
            const urlPath = `repos/${repo}/pulls?per_page=${perPage}&state=all&sort=updated&direction=desc&page=${pageIdx}`;
            const res = await http.getJson(urlPath, opts);
            apiQuotaAffected = true;
            requestsTotal += 1;
            const { headers: { link: linkHeader }, } = res;
            let { body: page } = res;
            if (username) {
                page = page.filter((ghPr) => ghPr?.user?.login && ghPr.user.login === username);
            }
            for (const ghPr of page) {
                massageGhRestPr(ghPr);
            }
            needNextPageSync = prApiCache.reconcile(page);
            needNextPageFetch = !!(0, url_1.parseLinkHeader)(linkHeader)?.next;
            if (pageIdx === 1) {
                needNextPageFetch && (needNextPageFetch = !opts.paginate);
            }
            pageIdx += 1;
        }
        logger_1.logger.debug({
            pullsTotal: prApiCache.getItems().length,
            requestsTotal,
            apiQuotaAffected,
        }, `getPrList success`);
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.debug({ err }, 'getPrList err');
        throw new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Github);
    }
    const cacheItems = prApiCache.getItems();
    for (const ghPr of cacheItems) {
        const pr = (0, common_1.coerceRestPr)(ghPr);
        if (pr) {
            prCache[ghPr.number] = pr;
        }
    }
    return prCache;
}
exports.getPrCache = getPrCache;
//# sourceMappingURL=pr.js.map