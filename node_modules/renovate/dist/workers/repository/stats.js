"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printRequestStats = void 0;
const tslib_1 = require("tslib");
const url_1 = tslib_1.__importDefault(require("url"));
const logger_1 = require("../../logger");
const memCache = tslib_1.__importStar(require("../../util/cache/memory"));
function printRequestStats() {
    const httpRequests = memCache.get('http-requests');
    // istanbul ignore next
    if (!httpRequests) {
        return;
    }
    httpRequests.sort((a, b) => {
        if (a.url === b.url) {
            return 0;
        }
        if (a.url < b.url) {
            return -1;
        }
        return 1;
    });
    const allRequests = [];
    const requestHosts = {};
    const rawUrls = {};
    for (const httpRequest of httpRequests) {
        const { method, url, duration, queueDuration, statusCode } = httpRequest;
        const [baseUrl] = url.split('?');
        // put method last for better sorting
        const urlKey = `${baseUrl} (${method.toUpperCase()},${statusCode})`;
        if (rawUrls[urlKey]) {
            rawUrls[urlKey] += 1;
        }
        else {
            rawUrls[urlKey] = 1;
        }
        allRequests.push(`${method.toUpperCase()} ${url} ${statusCode} ${duration} ${queueDuration}`);
        const { hostname } = url_1.default.parse(url);
        // istanbul ignore if: TODO: fix types (#9610)
        if (!hostname) {
            return;
        }
        requestHosts[hostname] = requestHosts[hostname] || [];
        requestHosts[hostname].push(httpRequest);
    }
    const urls = {};
    // Sort urls for easier reading
    for (const url of Object.keys(rawUrls).sort()) {
        urls[url] = rawUrls[url];
    }
    logger_1.logger.trace({ allRequests, requestHosts }, 'full stats');
    const hostStats = {};
    let totalRequests = 0;
    for (const [hostname, requests] of Object.entries(requestHosts)) {
        const requestCount = requests.length;
        totalRequests += requestCount;
        const requestSum = requests
            .map(({ duration }) => duration)
            .reduce((a, b) => a + b, 0);
        const requestAvgMs = Math.round(requestSum / requestCount);
        const queueSum = requests
            .map(({ queueDuration }) => queueDuration)
            .reduce((a, b) => a + b, 0);
        const queueAvgMs = Math.round(queueSum / requestCount);
        hostStats[hostname] = { requestCount, requestAvgMs, queueAvgMs };
    }
    logger_1.logger.debug({ urls, hostStats, totalRequests }, 'http statistics');
}
exports.printRequestStats = printRequestStats;
//# sourceMappingURL=stats.js.map