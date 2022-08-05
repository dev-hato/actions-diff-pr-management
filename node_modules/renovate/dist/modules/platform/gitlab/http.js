"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserBusy = exports.getUserID = exports.gitlabApi = void 0;
const logger_1 = require("../../../logger");
const gitlab_1 = require("../../../util/http/gitlab");
exports.gitlabApi = new gitlab_1.GitlabHttp();
async function getUserID(username) {
    return (await exports.gitlabApi.getJson(`users?username=${username}`)).body[0].id;
}
exports.getUserID = getUserID;
async function isUserBusy(user) {
    try {
        const url = `/users/${user}/status`;
        const userStatus = (await exports.gitlabApi.getJson(url)).body;
        return userStatus.availability === 'busy';
    }
    catch (err) {
        logger_1.logger.warn({ err }, 'Failed to get user status');
        return false;
    }
}
exports.isUserBusy = isUserBusy;
//# sourceMappingURL=http.js.map