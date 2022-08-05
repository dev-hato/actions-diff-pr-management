"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketServerHttp = exports.setBaseUrl = void 0;
const constants_1 = require("../../constants");
const url_1 = require("../url");
const _1 = require(".");
let baseUrl;
const setBaseUrl = (url) => {
    baseUrl = url;
};
exports.setBaseUrl = setBaseUrl;
class BitbucketServerHttp extends _1.Http {
    constructor(options) {
        super(constants_1.PlatformId.BitbucketServer, options);
    }
    request(path, options) {
        const url = (0, url_1.resolveBaseUrl)(baseUrl, path);
        const opts = {
            baseUrl,
            ...options,
        };
        opts.headers = {
            ...opts.headers,
            'X-Atlassian-Token': 'no-check',
        };
        return super.request(url, opts);
    }
}
exports.BitbucketServerHttp = BitbucketServerHttp;
//# sourceMappingURL=bitbucket-server.js.map