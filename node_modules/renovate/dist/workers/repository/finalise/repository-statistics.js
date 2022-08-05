"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRenovateRepoStats = void 0;
const logger_1 = require("../../../logger");
const types_1 = require("../../../types");
function runRenovateRepoStats(config, prList) {
    const prStats = { total: 0, open: 0, closed: 0, merged: 0 };
    for (const pr of prList) {
        if (pr.title === 'Configure Renovate' ||
            pr.title === config.onboardingPrTitle) {
            continue;
        }
        prStats.total += 1;
        switch (pr.state) {
            case types_1.PrState.Merged:
                prStats.merged += 1;
                break;
            case types_1.PrState.Closed:
                prStats.closed += 1;
                break;
            case types_1.PrState.Open:
                prStats.open += 1;
                break;
            default:
                break;
        }
    }
    logger_1.logger.debug({ stats: prStats }, `Renovate repository PR statistics`);
}
exports.runRenovateRepoStats = runRenovateRepoStats;
//# sourceMappingURL=repository-statistics.js.map