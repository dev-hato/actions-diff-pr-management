"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setArtifactErrorStatus = void 0;
const global_1 = require("../../../../config/global");
const logger_1 = require("../../../../logger");
const platform_1 = require("../../../../modules/platform");
const types_1 = require("../../../../types");
async function setArtifactErrorStatus(config) {
    if (!config.artifactErrors?.length) {
        // no errors
        return;
    }
    const context = `renovate/artifacts`;
    const description = 'Artifact file update failure';
    const state = types_1.BranchStatus.red;
    const existingState = await platform_1.platform.getBranchStatusCheck(config.branchName, context);
    // Check if state needs setting
    if (existingState !== state) {
        logger_1.logger.debug(`Updating status check state to failed`);
        if (global_1.GlobalConfig.get('dryRun')) {
            logger_1.logger.info('DRY-RUN: Would set branch status in ' + config.branchName);
        }
        else {
            await platform_1.platform.setBranchStatus({
                branchName: config.branchName,
                context,
                description,
                state,
            });
        }
    }
}
exports.setArtifactErrorStatus = setArtifactErrorStatus;
//# sourceMappingURL=artifacts.js.map