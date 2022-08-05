"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.getQueue = void 0;
const tslib_1 = require("tslib");
const p_queue_1 = tslib_1.__importDefault(require("p-queue"));
const url_1 = require("../url");
const host_rules_1 = require("./host-rules");
const hostQueues = new Map();
function getQueue(url) {
    const host = (0, url_1.parseUrl)(url)?.host;
    if (!host) {
        return null;
    }
    let queue = hostQueues.get(host);
    if (queue === undefined) {
        queue = null; // null represents "no queue", as opposed to undefined
        const concurrency = (0, host_rules_1.getRequestLimit)(url);
        if (concurrency) {
            queue = new p_queue_1.default({ concurrency });
        }
    }
    hostQueues.set(host, queue);
    return queue;
}
exports.getQueue = getQueue;
function clear() {
    hostQueues.clear();
}
exports.clear = clear;
//# sourceMappingURL=queue.js.map