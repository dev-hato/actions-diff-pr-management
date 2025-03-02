"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
const get_pull_requests_1 = require("./get_pull_requests");
async function script({ github, context, }) {
    const HEAD_REF = process.env.HEAD_REF;
    const pulls = await (0, get_pull_requests_1.getPullRequests)({ github, context }, HEAD_REF);
    return pulls.length;
}
