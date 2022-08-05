"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfidence = exports.setStability = exports.resolveBranchStatus = void 0;
const logger_1 = require("../../../../logger");
const platform_1 = require("../../../../modules/platform");
const types_1 = require("../../../../types");
const merge_confidence_1 = require("../../../../util/merge-confidence");
async function resolveBranchStatus(branchName, ignoreTests = false) {
    logger_1.logger.debug(`resolveBranchStatus(branchName=${branchName}, ignoreTests=${ignoreTests})`);
    if (ignoreTests) {
        logger_1.logger.debug('Ignore tests. Return green');
        return types_1.BranchStatus.green;
    }
    const status = await platform_1.platform.getBranchStatus(branchName);
    logger_1.logger.debug(`Branch status ${status}`);
    return status;
}
exports.resolveBranchStatus = resolveBranchStatus;
async function setStatusCheck(branchName, context, description, state, url) {
    const existingState = await platform_1.platform.getBranchStatusCheck(branchName, context);
    if (existingState === state) {
        logger_1.logger.debug(`Status check ${context} is already up-to-date`);
    }
    else {
        logger_1.logger.debug(`Updating ${context} status check state to ${state}`);
        await platform_1.platform.setBranchStatus({
            branchName,
            context,
            description,
            state,
            url,
        });
    }
}
async function setStability(config) {
    if (!config.stabilityStatus) {
        return;
    }
    const context = `renovate/stability-days`;
    const description = config.stabilityStatus === types_1.BranchStatus.green
        ? 'Updates have met stability days requirement'
        : 'Updates have not met stability days requirement';
    await setStatusCheck(config.branchName, context, description, config.stabilityStatus, config.productLinks?.documentation);
}
exports.setStability = setStability;
async function setConfidence(config) {
    if (!config.branchName ||
        !config.confidenceStatus ||
        (config.minimumConfidence &&
            !(0, merge_confidence_1.isActiveConfidenceLevel)(config.minimumConfidence))) {
        return;
    }
    const context = `renovate/merge-confidence`;
    const description = config.confidenceStatus === types_1.BranchStatus.green
        ? 'Updates have met Merge Confidence requirement'
        : 'Updates have not met Merge Confidence requirement';
    await setStatusCheck(config.branchName, context, description, config.confidenceStatus, config.productLinks?.documentation);
}
exports.setConfidence = setConfidence;
//# sourceMappingURL=status-checks.js.map