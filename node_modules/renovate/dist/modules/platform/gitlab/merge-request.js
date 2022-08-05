"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMR = exports.getMR = void 0;
const logger_1 = require("../../../logger");
const http_1 = require("./http");
async function getMR(repository, iid) {
    logger_1.logger.debug(`getMR(${iid})`);
    const url = `projects/${repository}/merge_requests/${iid}?include_diverged_commits_count=1`;
    return (await http_1.gitlabApi.getJson(url)).body;
}
exports.getMR = getMR;
async function updateMR(repository, iid, data) {
    logger_1.logger.debug(`updateMR(${iid})`);
    const url = `projects/${repository}/merge_requests/${iid}`;
    await http_1.gitlabApi.putJson(url, {
        body: data,
    });
}
exports.updateMR = updateMR;
//# sourceMappingURL=merge-request.js.map