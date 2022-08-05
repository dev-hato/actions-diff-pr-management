"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabHttp = exports.setBaseUrl = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const constants_1 = require("../../constants");
const logger_1 = require("../../logger");
const external_host_error_1 = require("../../types/errors/external-host-error");
const url_1 = require("../url");
const _1 = require(".");
let baseUrl = 'https://gitlab.com/api/v4/';
const setBaseUrl = (url) => {
    baseUrl = url;
};
exports.setBaseUrl = setBaseUrl;
class GitlabHttp extends _1.Http {
    constructor(type = constants_1.PlatformId.Gitlab, options) {
        super(type, options);
    }
    async request(url, options) {
        const opts = {
            baseUrl,
            ...options,
            throwHttpErrors: true,
        };
        try {
            const result = await super.request(url, opts);
            if (opts.paginate && is_1.default.array(result.body)) {
                // Check if result is paginated
                try {
                    const linkHeader = (0, url_1.parseLinkHeader)(result.headers.link);
                    const nextUrl = linkHeader?.next?.url
                        ? (0, url_1.parseUrl)(linkHeader.next.url)
                        : null;
                    if (nextUrl) {
                        if (process.env.GITLAB_IGNORE_REPO_URL) {
                            const defaultEndpoint = new URL(baseUrl);
                            nextUrl.protocol = defaultEndpoint.protocol;
                            nextUrl.host = defaultEndpoint.host;
                        }
                        const nextResult = await this.request(nextUrl, opts);
                        if (is_1.default.array(nextResult.body)) {
                            result.body.push(...nextResult.body);
                        }
                    }
                }
                catch (err) /* istanbul ignore next */ {
                    logger_1.logger.warn({ err }, 'Pagination error');
                }
            }
            return result;
        }
        catch (err) {
            if (err.statusCode === 404) {
                logger_1.logger.trace({ err }, 'GitLab 404');
                logger_1.logger.debug({ url: err.url }, 'GitLab API 404');
                throw err;
            }
            logger_1.logger.debug({ err }, 'Gitlab API error');
            if (err.statusCode === 429 ||
                (err.statusCode >= 500 && err.statusCode < 600)) {
                throw new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Gitlab);
            }
            const platformFailureCodes = [
                'EAI_AGAIN',
                'ECONNRESET',
                'ETIMEDOUT',
                'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
            ];
            if (platformFailureCodes.includes(err.code)) {
                throw new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Gitlab);
            }
            if (err.name === 'ParseError') {
                throw new external_host_error_1.ExternalHostError(err, constants_1.PlatformId.Gitlab);
            }
            throw err;
        }
    }
}
exports.GitlabHttp = GitlabHttp;
//# sourceMappingURL=gitlab.js.map