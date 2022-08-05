"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// istanbul ignore file
const got_1 = require("got");
const url_1 = require("../url");
// TODO: remove when code is refactored (#9651)
Object.defineProperty(got_1.RequestError.prototype, 'statusCode', {
    get: function statusCode() {
        return this.response?.statusCode;
    },
});
Object.defineProperty(got_1.RequestError.prototype, 'body', {
    get: function body() {
        return this.response?.body;
    },
    set: function body(value) {
        if (this.response) {
            this.response.body = value;
        }
    },
});
Object.defineProperty(got_1.RequestError.prototype, 'headers', {
    get: function headers() {
        return this.response?.headers;
    },
});
Object.defineProperty(got_1.RequestError.prototype, 'url', {
    get: function url() {
        return this.response?.url;
    },
});
Object.defineProperty(got_1.RequestError.prototype, 'host', {
    get: function url() {
        const urlStr = this.response?.url;
        const url = urlStr ? (0, url_1.parseUrl)(urlStr) : null;
        return url?.host;
    },
});
//# sourceMappingURL=legacy.js.map