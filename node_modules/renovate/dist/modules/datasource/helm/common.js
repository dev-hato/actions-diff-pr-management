"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSourceUrl = void 0;
const regex_1 = require("../../../util/regex");
const chartRepo = (0, regex_1.regEx)(/charts?|helm|helm-charts/i);
const githubUrl = (0, regex_1.regEx)(/^(?<url>https:\/\/github\.com\/[^/]+\/(?<repo>[^/]+))(:?\/|\/tree\/[^/]+\/(?<path>.+))?$/);
const githubRelease = (0, regex_1.regEx)(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/releases\//);
function findSourceUrl(release) {
    // it's a github release :)
    const releaseMatch = githubRelease.exec(release.urls[0]);
    if (releaseMatch) {
        return { sourceUrl: releaseMatch[1] };
    }
    if (release.home) {
        const githubUrlMatch = githubUrl.exec(release.home);
        if (githubUrlMatch?.groups && chartRepo.test(githubUrlMatch?.groups.repo)) {
            return {
                sourceUrl: githubUrlMatch.groups.url,
                sourceDirectory: githubUrlMatch.groups.path,
            };
        }
    }
    if (!release.sources?.length) {
        return {};
    }
    for (const url of release.sources) {
        const githubUrlMatch = githubUrl.exec(url);
        if (githubUrlMatch?.groups && chartRepo.test(githubUrlMatch?.groups.repo)) {
            return {
                sourceUrl: githubUrlMatch.groups.url,
                sourceDirectory: githubUrlMatch.groups.path,
            };
        }
    }
    // fallback
    return { sourceUrl: release.sources[0] };
}
exports.findSourceUrl = findSourceUrl;
//# sourceMappingURL=common.js.map