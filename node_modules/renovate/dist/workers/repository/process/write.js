"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeUpdates = void 0;
const logger_1 = require("../../../logger");
const git_1 = require("../../../util/git");
const limits_1 = require("../../global/limits");
const types_1 = require("../../types");
const branch_1 = require("../update/branch");
const limits_2 = require("./limits");
async function writeUpdates(config, allBranches) {
    const branches = allBranches;
    logger_1.logger.debug(`Processing ${branches.length} branch${branches.length === 1 ? '' : 'es'}: ${branches
        .map((b) => b.branchName)
        .sort()
        .join(', ')}`);
    const prsRemaining = await (0, limits_2.getPrsRemaining)(config, branches);
    logger_1.logger.debug({ prsRemaining }, 'Calculated maximum PRs remaining this run');
    (0, limits_1.setMaxLimit)(limits_1.Limit.PullRequests, prsRemaining);
    const branchesRemaining = await (0, limits_2.getBranchesRemaining)(config, branches);
    logger_1.logger.debug({ branchesRemaining }, 'Calculated maximum branches remaining this run');
    (0, limits_1.setMaxLimit)(limits_1.Limit.Branches, branchesRemaining);
    for (const branch of branches) {
        (0, logger_1.addMeta)({ branch: branch.branchName });
        const branchExisted = (0, git_1.branchExists)(branch.branchName);
        const res = await (0, branch_1.processBranch)(branch);
        branch.prBlockedBy = res?.prBlockedBy;
        branch.prNo = res?.prNo;
        branch.result = res?.result;
        if (branch.result === types_1.BranchResult.Automerged &&
            branch.automergeType !== 'pr-comment') {
            // Stop processing other branches because base branch has been changed
            return 'automerged';
        }
        if (!branchExisted && (0, git_1.branchExists)(branch.branchName)) {
            (0, limits_1.incLimitedValue)(limits_1.Limit.Branches);
        }
    }
    (0, logger_1.removeMeta)(['branch']);
    return 'done';
}
exports.writeUpdates = writeUpdates;
//# sourceMappingURL=write.js.map