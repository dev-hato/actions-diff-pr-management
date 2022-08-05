"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoConfig = void 0;
const branch_1 = require("../onboarding/branch");
const merge_1 = require("./merge");
const semantic_1 = require("./semantic");
// istanbul ignore next
async function getRepoConfig(config_) {
    let config = { ...config_ };
    config.baseBranch = config.defaultBranch;
    if (config.semanticCommits === 'auto') {
        config.semanticCommits = await (0, semantic_1.detectSemanticCommits)();
    }
    config = await (0, branch_1.checkOnboardingBranch)(config);
    config = await (0, merge_1.mergeRenovateConfig)(config);
    return config;
}
exports.getRepoConfig = getRepoConfig;
//# sourceMappingURL=config.js.map