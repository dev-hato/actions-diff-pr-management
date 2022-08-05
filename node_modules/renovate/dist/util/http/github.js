"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubHttp = exports.setBaseUrl = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const luxon_1 = require("luxon");
const p_all_1 = tslib_1.__importDefault(require("p-all"));
const constants_1 = require("../../constants");
const error_messages_1 = require("../../constants/error-messages");
const logger_1 = require("../../logger");
const external_host_error_1 = require("../../types/errors/external-host-error");
const repository_1 = require("../cache/repository");
const mask_1 = require("../mask");
const range_1 = require("../range");
const regex_1 = require("../regex");
const url_1 = require("../url");
const _1 = require(".");
const githubBaseUrl = 'https://api.github.com/';
let baseUrl = githubBaseUrl;
const setBaseUrl = (url) => {
    baseUrl = url;
};
exports.setBaseUrl = setBaseUrl;
function handleGotError(err, url, opts) {
    const path = url.toString();
    let message = err.message || '';
    const body = err.response?.body;
    if (is_1.default.plainObject(body) && 'message' in body) {
        message = String(body.message);
    }
    if (err.code === 'ENOTFOUND' ||
        err.code === 'ETIMEDOUT' ||
        err.code === 'EAI_AGAIN' ||
        err.code === 'ECONNRESET') {
        logger_1.logger.debug({ err }, 'GitHub failure: RequestError');
        return new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Github);
    }
    if (err.name === 'ParseError') {
        logger_1.logger.debug({ err }, '');
        return new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Github);
    }
    if (err.statusCode && err.statusCode >= 500 && err.statusCode < 600) {
        logger_1.logger.debug({ err }, 'GitHub failure: 5xx');
        return new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Github);
    }
    if (err.statusCode === 403 &&
        message.startsWith('You have triggered an abuse detection mechanism')) {
        logger_1.logger.debug({ err }, 'GitHub failure: abuse detection');
        return new Error(error_messages_1.PLATFORM_RATE_LIMIT_EXCEEDED);
    }
    if (err.statusCode === 403 &&
        message.startsWith('You have exceeded a secondary rate limit')) {
        logger_1.logger.debug({ err }, 'GitHub failure: secondary rate limit');
        return new Error(error_messages_1.PLATFORM_RATE_LIMIT_EXCEEDED);
    }
    if (err.statusCode === 403 && message.includes('Upgrade to GitHub Pro')) {
        logger_1.logger.debug({ path }, 'Endpoint needs paid GitHub plan');
        return err;
    }
    if (err.statusCode === 403 && message.includes('rate limit exceeded')) {
        logger_1.logger.debug({ err }, 'GitHub failure: rate limit');
        return new Error(error_messages_1.PLATFORM_RATE_LIMIT_EXCEEDED);
    }
    if (err.statusCode === 403 &&
        message.startsWith('Resource not accessible by integration')) {
        logger_1.logger.debug({ err }, 'GitHub failure: Resource not accessible by integration');
        return new Error(error_messages_1.PLATFORM_INTEGRATION_UNAUTHORIZED);
    }
    if (err.statusCode === 401 && message.includes('Bad credentials')) {
        const rateLimit = err.headers?.['x-ratelimit-limit'] ?? -1;
        logger_1.logger.debug({
            token: (0, mask_1.maskToken)(opts.token),
            err,
        }, 'GitHub failure: Bad credentials');
        if (rateLimit === '60') {
            return new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Github);
        }
        return new Error(error_messages_1.PLATFORM_BAD_CREDENTIALS);
    }
    if (err.statusCode === 422) {
        if (message.includes('Review cannot be requested from pull request author')) {
            return err;
        }
        else if (err.body?.errors?.find((e) => e.code === 'invalid')) {
            logger_1.logger.debug({ err }, 'Received invalid response - aborting');
            return new Error(error_messages_1.REPOSITORY_CHANGED);
        }
        else if (err.body?.errors?.find((e) => e.message?.startsWith('A pull request already exists'))) {
            return err;
        }
        logger_1.logger.debug({ err }, '422 Error thrown from GitHub');
        return new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Github);
    }
    if (err.statusCode === 410 &&
        err.body?.message === 'Issues are disabled for this repo') {
        return err;
    }
    if (err.statusCode === 404) {
        logger_1.logger.debug({ url: path }, 'GitHub 404');
    }
    else {
        logger_1.logger.debug({ err }, 'Unknown GitHub error');
    }
    return err;
}
function constructAcceptString(input) {
    const defaultAccept = 'application/vnd.github.v3+json';
    const acceptStrings = typeof input === 'string' ? input.split((0, regex_1.regEx)(/\s*,\s*/)) : [];
    if (!acceptStrings.some((x) => x.startsWith('application/vnd.github.')) ||
        acceptStrings.length < 2) {
        acceptStrings.push(defaultAccept);
    }
    return acceptStrings.join(', ');
}
const MAX_GRAPHQL_PAGE_SIZE = 100;
function getGraphqlPageSize(fieldName, defaultPageSize = MAX_GRAPHQL_PAGE_SIZE) {
    const cache = (0, repository_1.getCache)();
    const graphqlPageCache = cache?.platform?.github
        ?.graphqlPageCache;
    const cachedRecord = graphqlPageCache?.[fieldName];
    if (graphqlPageCache && cachedRecord) {
        logger_1.logger.debug({ fieldName, ...cachedRecord }, 'GraphQL page size: found cached value');
        const oldPageSize = cachedRecord.pageSize;
        const now = luxon_1.DateTime.local();
        const then = luxon_1.DateTime.fromISO(cachedRecord.pageLastResizedAt);
        const expiry = then.plus({ hours: 24 });
        if (now > expiry) {
            const newPageSize = Math.min(oldPageSize * 2, MAX_GRAPHQL_PAGE_SIZE);
            if (newPageSize < MAX_GRAPHQL_PAGE_SIZE) {
                const timestamp = now.toISO();
                logger_1.logger.debug({ fieldName, oldPageSize, newPageSize, timestamp }, 'GraphQL page size: expanding');
                cachedRecord.pageLastResizedAt = timestamp;
                cachedRecord.pageSize = newPageSize;
            }
            else {
                logger_1.logger.debug({ fieldName, oldPageSize, newPageSize }, 'GraphQL page size: expanded to default page size');
                delete graphqlPageCache[fieldName];
            }
            return newPageSize;
        }
        return oldPageSize;
    }
    return defaultPageSize;
}
function setGraphqlPageSize(fieldName, newPageSize) {
    var _a, _b;
    const oldPageSize = getGraphqlPageSize(fieldName);
    if (newPageSize !== oldPageSize) {
        const now = luxon_1.DateTime.local();
        const pageLastResizedAt = now.toISO();
        logger_1.logger.debug({ fieldName, oldPageSize, newPageSize, timestamp: pageLastResizedAt }, 'GraphQL page size: shrinking');
        const cache = (0, repository_1.getCache)();
        cache.platform ?? (cache.platform = {});
        (_a = cache.platform).github ?? (_a.github = {});
        (_b = cache.platform.github).graphqlPageCache ?? (_b.graphqlPageCache = {});
        const graphqlPageCache = cache.platform.github
            .graphqlPageCache;
        graphqlPageCache[fieldName] = {
            pageLastResizedAt,
            pageSize: newPageSize,
        };
    }
}
class GithubHttp extends _1.Http {
    constructor(hostType = constants_1.PlatformId.Github, options) {
        super(hostType, options);
    }
    async request(url, options, okToRetry = true) {
        const opts = {
            baseUrl,
            ...options,
            throwHttpErrors: true,
        };
        const accept = constructAcceptString(opts.headers?.accept);
        opts.headers = {
            ...opts.headers,
            accept,
        };
        try {
            const result = await super.request(url, opts);
            if (opts.paginate) {
                // Check if result is paginated
                const pageLimit = opts.pageLimit ?? 10;
                const linkHeader = (0, url_1.parseLinkHeader)(result?.headers?.link);
                if (linkHeader?.next && linkHeader?.last) {
                    let lastPage = parseInt(linkHeader.last.page, 10);
                    // istanbul ignore else: needs a test
                    if (!process.env.RENOVATE_PAGINATE_ALL && opts.paginate !== 'all') {
                        lastPage = Math.min(pageLimit, lastPage);
                    }
                    const queue = [...(0, range_1.range)(2, lastPage)].map((pageNumber) => () => {
                        const nextUrl = new URL(linkHeader.next.url, baseUrl);
                        nextUrl.searchParams.set('page', String(pageNumber));
                        return this.request(nextUrl, { ...opts, paginate: false }, okToRetry);
                    });
                    const pages = await (0, p_all_1.default)(queue, { concurrency: 5 });
                    if (opts.paginationField && is_1.default.plainObject(result.body)) {
                        const paginatedResult = result.body[opts.paginationField];
                        if (is_1.default.array(paginatedResult)) {
                            for (const nextPage of pages) {
                                if (is_1.default.plainObject(nextPage.body)) {
                                    const nextPageResults = nextPage.body[opts.paginationField];
                                    if (is_1.default.array(nextPageResults)) {
                                        paginatedResult.push(...nextPageResults);
                                    }
                                }
                            }
                        }
                    }
                    else if (is_1.default.array(result.body)) {
                        for (const nextPage of pages) {
                            if (is_1.default.array(nextPage.body)) {
                                result.body.push(...nextPage.body);
                            }
                        }
                    }
                }
            }
            return result;
        }
        catch (err) {
            throw handleGotError(err, url, opts);
        }
    }
    async requestGraphql(query, options = {}) {
        const path = 'graphql';
        const { paginate, count = MAX_GRAPHQL_PAGE_SIZE, cursor = null } = options;
        let { variables } = options;
        if (paginate) {
            variables = {
                ...variables,
                count,
                cursor,
            };
        }
        const body = variables ? { query, variables } : { query };
        const opts = {
            baseUrl: baseUrl.replace('/v3/', '/'),
            body,
            headers: { accept: options?.acceptHeader },
        };
        logger_1.logger.trace(`Performing Github GraphQL request`);
        try {
            const res = await this.postJson('graphql', opts);
            return res?.body;
        }
        catch (err) {
            logger_1.logger.debug({ err, query, options }, 'Unexpected GraphQL Error');
            if (err instanceof external_host_error_1.ExternalHostError && count && count > 10) {
                logger_1.logger.info('Reducing pagination count to workaround graphql errors');
                return null;
            }
            throw handleGotError(err, path, opts);
        }
    }
    async queryRepoField(query, fieldName, options = {}) {
        const result = [];
        const { paginate = true } = options;
        let optimalCount = null;
        let count = getGraphqlPageSize(fieldName, options.count ?? MAX_GRAPHQL_PAGE_SIZE);
        let limit = options.limit ?? 1000;
        let cursor = null;
        let isIterating = true;
        while (isIterating) {
            const res = await this.requestGraphql(query, {
                ...options,
                count: Math.min(count, limit),
                cursor,
                paginate,
            });
            const repositoryData = res?.data?.repository;
            if (repositoryData &&
                is_1.default.plainObject(repositoryData) &&
                repositoryData[fieldName]) {
                optimalCount = count;
                const { nodes = [], edges = [], pageInfo, } = repositoryData[fieldName];
                result.push(...nodes);
                result.push(...edges);
                limit = Math.max(0, limit - nodes.length - edges.length);
                if (limit === 0) {
                    isIterating = false;
                }
                else if (paginate && pageInfo) {
                    const { hasNextPage, endCursor } = pageInfo;
                    if (hasNextPage && endCursor) {
                        cursor = endCursor;
                    }
                    else {
                        isIterating = false;
                    }
                }
            }
            else {
                count = Math.floor(count / 2);
                if (count === 0) {
                    logger_1.logger.warn({ query, options, res }, 'Error fetching GraphQL nodes');
                    isIterating = false;
                }
            }
            if (!paginate) {
                isIterating = false;
            }
        }
        if (optimalCount && optimalCount < MAX_GRAPHQL_PAGE_SIZE) {
            setGraphqlPageSize(fieldName, optimalCount);
        }
        return result;
    }
}
exports.GithubHttp = GithubHttp;
//# sourceMappingURL=github.js.map