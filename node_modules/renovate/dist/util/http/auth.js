"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAuthorization = exports.applyAuthorization = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const constants_1 = require("../../constants");
function applyAuthorization(inOptions) {
    const options = { ...inOptions };
    if (options.headers?.authorization || options.noAuth) {
        return options;
    }
    options.headers ?? (options.headers = {});
    if (options.token) {
        if (options.hostType === constants_1.PlatformId.Gitea) {
            options.headers.authorization = `token ${options.token}`;
        }
        else if (options.hostType &&
            constants_1.GITHUB_API_USING_HOST_TYPES.includes(options.hostType)) {
            options.headers.authorization = `token ${options.token}`;
            if (options.token.startsWith('x-access-token:')) {
                const appToken = options.token.replace('x-access-token:', '');
                options.headers.authorization = `token ${appToken}`;
                if (is_1.default.string(options.headers.accept)) {
                    options.headers.accept = options.headers.accept.replace('application/vnd.github.v3+json', 'application/vnd.github.machine-man-preview+json');
                }
            }
        }
        else if (options.hostType &&
            constants_1.GITLAB_API_USING_HOST_TYPES.includes(options.hostType)) {
            // GitLab versions earlier than 12.2 only support authentication with
            // a personal access token, which is 20 characters long.
            if (options.token.length === 20) {
                options.headers['Private-token'] = options.token;
            }
            else {
                options.headers.authorization = `Bearer ${options.token}`;
            }
        }
        else {
            // Custom Auth type, eg `Basic XXXX_TOKEN`
            const type = options.context?.authType ?? 'Bearer';
            if (type === 'Token-Only') {
                options.headers.authorization = options.token;
            }
            else {
                options.headers.authorization = `${type} ${options.token}`;
            }
        }
        delete options.token;
    }
    else if (options.password !== undefined) {
        // Otherwise got will add username and password to url and header
        const auth = Buffer.from(`${options.username ?? ''}:${options.password}`).toString('base64');
        options.headers.authorization = `Basic ${auth}`;
        delete options.username;
        delete options.password;
    }
    return options;
}
exports.applyAuthorization = applyAuthorization;
// isAmazon return true if request options contains Amazon related headers
function isAmazon(options) {
    return !!options.search?.includes('X-Amz-Algorithm');
}
// isAzureBlob return true if request options contains Azure container registry related data
function isAzureBlob(options) {
    return !!(options.hostname?.endsWith('.blob.core.windows.net') && // lgtm [js/incomplete-url-substring-sanitization]
        options.href?.includes('/docker/registry'));
}
// removeAuthorization from the redirect options
function removeAuthorization(options) {
    if (!options.password && !options.headers?.authorization) {
        return;
    }
    // Check if request has been redirected to Amazon or an Azure blob (ACR)
    if (isAmazon(options) || isAzureBlob(options)) {
        // if there is no port in the redirect URL string, then delete it from the redirect options.
        // This can be evaluated for removal after upgrading to Got v10
        const portInUrl = options.href?.split?.('/')?.[2]?.split(':')?.[1];
        // istanbul ignore next
        if (!portInUrl) {
            delete options.port; // Redirect will instead use 80 or 443 for HTTP or HTTPS respectively
        }
        // registry is hosted on Amazon or Azure blob, redirect url includes
        // authentication which is not required and should be removed
        if (options?.headers?.authorization) {
            delete options.headers.authorization;
        }
        delete options.username;
        delete options.password;
    }
}
exports.removeAuthorization = removeAuthorization;
//# sourceMappingURL=auth.js.map