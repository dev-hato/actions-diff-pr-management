"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prInfo = exports.accumulateValues = exports.buildStates = exports.prStates = exports.mergeBodyTransformer = exports.repoInfoTransformer = void 0;
const tslib_1 = require("tslib");
const url_1 = tslib_1.__importDefault(require("url"));
const types_1 = require("../../../types");
const bitbucket_1 = require("../../../util/http/bitbucket");
const pr_body_1 = require("../pr-body");
const bitbucketHttp = new bitbucket_1.BitbucketHttp();
function repoInfoTransformer(repoInfoBody) {
    return {
        isFork: !!repoInfoBody.parent,
        owner: repoInfoBody.owner.username,
        mainbranch: repoInfoBody.mainbranch.name,
        mergeMethod: 'merge',
        has_issues: repoInfoBody.has_issues,
    };
}
exports.repoInfoTransformer = repoInfoTransformer;
const bitbucketMergeStrategies = new Map([
    ['squash', 'squash'],
    ['merge-commit', 'merge_commit'],
    ['fast-forward', 'fast_forward'],
]);
function mergeBodyTransformer(mergeStrategy) {
    const body = {
        close_source_branch: true,
    };
    // The `auto` strategy will use the strategy configured inside Bitbucket.
    if (mergeStrategy && mergeStrategy !== 'auto') {
        body.merge_strategy = bitbucketMergeStrategies.get(mergeStrategy);
    }
    return body;
}
exports.mergeBodyTransformer = mergeBodyTransformer;
exports.prStates = {
    open: ['OPEN'],
    notOpen: ['MERGED', 'DECLINED', 'SUPERSEDED'],
    merged: ['MERGED'],
    closed: ['DECLINED', 'SUPERSEDED'],
    all: ['OPEN', 'MERGED', 'DECLINED', 'SUPERSEDED'],
};
exports.buildStates = {
    green: 'SUCCESSFUL',
    red: 'FAILED',
    yellow: 'INPROGRESS',
};
const addMaxLength = (inputUrl, pagelen = 100) => {
    const { search, ...parsedUrl } = url_1.default.parse(inputUrl, true); // eslint-disable-line @typescript-eslint/no-unused-vars
    const maxedUrl = url_1.default.format({
        ...parsedUrl,
        query: { ...parsedUrl.query, pagelen },
    });
    return maxedUrl;
};
function callApi(apiUrl, method, options) {
    /* istanbul ignore next */
    switch (method.toLowerCase()) {
        case 'post':
            return bitbucketHttp.postJson(apiUrl, options);
        case 'put':
            return bitbucketHttp.putJson(apiUrl, options);
        case 'patch':
            return bitbucketHttp.patchJson(apiUrl, options);
        case 'head':
            return bitbucketHttp.headJson(apiUrl, options);
        case 'delete':
            return bitbucketHttp.deleteJson(apiUrl, options);
        case 'get':
        default:
            return bitbucketHttp.getJson(apiUrl, options);
    }
}
async function accumulateValues(reqUrl, method = 'get', options, pagelen) {
    let accumulator = [];
    let nextUrl = addMaxLength(reqUrl, pagelen);
    while (typeof nextUrl !== 'undefined') {
        const { body } = await callApi(nextUrl, method, options);
        accumulator = [...accumulator, ...body.values];
        nextUrl = body.next;
    }
    return accumulator;
}
exports.accumulateValues = accumulateValues;
function prInfo(pr) {
    return {
        number: pr.id,
        displayNumber: `Pull Request #${pr.id}`,
        bodyStruct: (0, pr_body_1.getPrBodyStruct)(pr.summary?.raw),
        sourceBranch: pr.source?.branch?.name,
        targetBranch: pr.destination?.branch?.name,
        title: pr.title,
        state: exports.prStates.closed?.includes(pr.state)
            ? /* istanbul ignore next */ types_1.PrState.Closed
            : pr.state?.toLowerCase(),
        createdAt: pr.created_on,
    };
}
exports.prInfo = prInfo;
//# sourceMappingURL=utils.js.map