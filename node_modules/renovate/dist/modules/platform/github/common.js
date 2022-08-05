"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceRestPr = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const types_1 = require("../../../types");
const pr_body_1 = require("../pr-body");
/**
 * @see https://docs.github.com/en/rest/reference/pulls#list-pull-requests
 */
function coerceRestPr(pr) {
    if (!pr) {
        return null;
    }
    const bodyStruct = pr.bodyStruct ?? (0, pr_body_1.getPrBodyStruct)(pr.body);
    const result = {
        displayNumber: `Pull Request #${pr.number}`,
        number: pr.number,
        sourceBranch: pr.head?.ref,
        title: pr.title,
        state: pr.state === types_1.PrState.Closed && is_1.default.string(pr.merged_at)
            ? types_1.PrState.Merged
            : pr.state,
        bodyStruct,
    };
    if (pr.head?.sha) {
        result.sha = pr.head.sha;
    }
    if (pr.head?.repo?.full_name) {
        result.sourceRepo = pr.head.repo.full_name;
    }
    if (pr.labels) {
        result.labels = pr.labels.map(({ name }) => name);
    }
    if (pr.assignee || is_1.default.nonEmptyArray(pr.assignees)) {
        result.hasAssignees = true;
    }
    if (pr.requested_reviewers) {
        result.hasReviewers = true;
    }
    if (pr.created_at) {
        result.createdAt = pr.created_at;
    }
    if (pr.closed_at) {
        result.closedAt = pr.closed_at;
    }
    return result;
}
exports.coerceRestPr = coerceRestPr;
//# sourceMappingURL=common.js.map