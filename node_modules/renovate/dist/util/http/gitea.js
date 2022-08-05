"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiteaHttp = exports.setBaseUrl = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const constants_1 = require("../../constants");
const url_1 = require("../url");
const _1 = require(".");
let baseUrl;
const setBaseUrl = (newBaseUrl) => {
    baseUrl = newBaseUrl.replace(/\/*$/, '/'); // TODO #12875
};
exports.setBaseUrl = setBaseUrl;
function getPaginationContainer(body) {
    if (is_1.default.array(body) && body.length) {
        return body;
    }
    if (is_1.default.plainObject(body) && is_1.default.array(body?.data) && body.data.length) {
        return body.data;
    }
    return null;
}
function resolveUrl(path, base) {
    const resolvedUrlString = (0, url_1.resolveBaseUrl)(base, path);
    return new URL(resolvedUrlString);
}
class GiteaHttp extends _1.Http {
    constructor(options) {
        super(constants_1.PlatformId.Gitea, options);
    }
    async request(path, options) {
        const resolvedUrl = resolveUrl(path, options?.baseUrl ?? baseUrl);
        const opts = {
            baseUrl,
            ...options,
        };
        const res = await super.request(resolvedUrl, opts);
        const pc = getPaginationContainer(res.body);
        if (opts.paginate && pc) {
            const total = parseInt(res.headers['x-total-count'], 10);
            let nextPage = parseInt(resolvedUrl.searchParams.get('page') ?? '1', 10);
            while (total && pc.length < total) {
                nextPage += 1;
                resolvedUrl.searchParams.set('page', nextPage.toString());
                const nextRes = await super.request(resolvedUrl.toString(), opts);
                const nextPc = getPaginationContainer(nextRes.body);
                if (nextPc === null) {
                    break;
                }
                pc.push(...nextPc);
            }
        }
        return res;
    }
}
exports.GiteaHttp = GiteaHttp;
//# sourceMappingURL=gitea.js.map