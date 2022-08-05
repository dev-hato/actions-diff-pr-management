"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketHttp = exports.setBaseUrl = void 0;
const constants_1 = require("../../constants");
const _1 = require(".");
let baseUrl = 'https://api.bitbucket.org/';
const setBaseUrl = (url) => {
    baseUrl = url;
};
exports.setBaseUrl = setBaseUrl;
class BitbucketHttp extends _1.Http {
    constructor(type = constants_1.PlatformId.Bitbucket, options) {
        super(type, options);
    }
    request(url, options) {
        const opts = { baseUrl, ...options };
        return super.request(url, opts);
    }
}
exports.BitbucketHttp = BitbucketHttp;
//# sourceMappingURL=bitbucket.js.map