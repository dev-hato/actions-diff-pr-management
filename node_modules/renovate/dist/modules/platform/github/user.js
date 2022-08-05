"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserEmail = exports.getUserDetails = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const githubHttp = tslib_1.__importStar(require("../../../util/http/github"));
const githubApi = new githubHttp.GithubHttp();
async function getUserDetails(endpoint, token) {
    try {
        const userData = (await githubApi.getJson(endpoint + 'user', {
            token,
        })).body;
        return {
            username: userData.login,
            name: userData.name,
        };
    }
    catch (err) {
        logger_1.logger.debug({ err }, 'Error authenticating with GitHub');
        throw new Error('Init: Authentication failure');
    }
}
exports.getUserDetails = getUserDetails;
async function getUserEmail(endpoint, token) {
    try {
        const emails = (await githubApi.getJson(endpoint + 'user/emails', {
            token,
        })).body;
        return emails?.[0].email ?? null;
    }
    catch (err) {
        logger_1.logger.debug('Cannot read user/emails endpoint on GitHub to retrieve gitAuthor');
        return null;
    }
}
exports.getUserEmail = getUserEmail;
//# sourceMappingURL=user.js.map