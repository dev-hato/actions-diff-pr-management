"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCachedConflictResult = exports.getCachedConflictResult = void 0;
const repository_1 = require("../cache/repository");
function getCachedConflictResult(targetBranchName, targetBranchSha, sourceBranchName, sourceBranchSha) {
    const { gitConflicts } = (0, repository_1.getCache)();
    if (!gitConflicts) {
        return null;
    }
    const targetBranchConflicts = gitConflicts[targetBranchName];
    if (targetBranchConflicts?.targetBranchSha !== targetBranchSha) {
        return null;
    }
    const sourceBranchConflict = targetBranchConflicts.sourceBranches[sourceBranchName];
    if (sourceBranchConflict?.sourceBranchSha !== sourceBranchSha) {
        return null;
    }
    return sourceBranchConflict.isConflicted;
}
exports.getCachedConflictResult = getCachedConflictResult;
function setCachedConflictResult(targetBranchName, targetBranchSha, sourceBranchName, sourceBranchSha, isConflicted) {
    const cache = (0, repository_1.getCache)();
    cache.gitConflicts ?? (cache.gitConflicts = {});
    const { gitConflicts } = cache;
    let targetBranchConflicts = gitConflicts[targetBranchName];
    if (targetBranchConflicts?.targetBranchSha !== targetBranchSha) {
        gitConflicts[targetBranchName] = {
            targetBranchSha,
            sourceBranches: {},
        };
        targetBranchConflicts = gitConflicts[targetBranchName];
    }
    const sourceBranchConflict = targetBranchConflicts.sourceBranches[sourceBranchName];
    if (sourceBranchConflict?.sourceBranchSha !== sourceBranchSha) {
        targetBranchConflicts.sourceBranches[sourceBranchName] = {
            sourceBranchSha,
            isConflicted,
        };
    }
}
exports.setCachedConflictResult = setCachedConflictResult;
//# sourceMappingURL=conflicts-cache.js.map