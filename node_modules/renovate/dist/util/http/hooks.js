"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hooks = void 0;
function isResponseOk(response) {
    const { statusCode } = response;
    const limitStatusCode = response.request.options.followRedirect ? 299 : 399;
    return ((statusCode >= 200 && statusCode <= limitStatusCode) || statusCode === 304);
}
exports.hooks = {
    afterResponse: [
        (response) => {
            if (isResponseOk(response)) {
                response.request.destroy();
            }
            return response;
        },
    ],
};
//# sourceMappingURL=hooks.js.map