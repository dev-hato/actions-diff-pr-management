"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addParticipants = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const global_1 = require("../../../../config/global");
const logger_1 = require("../../../../logger");
const platform_1 = require("../../../../modules/platform");
const util_1 = require("../../../../util");
const code_owners_1 = require("./code-owners");
async function addCodeOwners(assigneesOrReviewers, pr) {
    return [...new Set(assigneesOrReviewers.concat(await (0, code_owners_1.codeOwnersForPr)(pr)))];
}
function filterUnavailableUsers(config, users) {
    return config.filterUnavailableUsers && platform_1.platform.filterUnavailableUsers
        ? platform_1.platform.filterUnavailableUsers(users)
        : Promise.resolve(users);
}
function noLeadingAtSymbol(input) {
    return input.length && input.startsWith('@') ? input.slice(1) : input;
}
function prepareParticipants(config, usernames) {
    const normalizedUsernames = [...new Set(usernames.map(noLeadingAtSymbol))];
    return filterUnavailableUsers(config, normalizedUsernames);
}
async function addParticipants(config, pr) {
    let assignees = config.assignees ?? [];
    logger_1.logger.debug(`addParticipants(pr=${pr?.number})`);
    if (config.assigneesFromCodeOwners) {
        assignees = await addCodeOwners(assignees, pr);
    }
    if (assignees.length > 0) {
        try {
            assignees = await prepareParticipants(config, assignees);
            if (is_1.default.number(config.assigneesSampleSize)) {
                assignees = (0, util_1.sampleSize)(assignees, config.assigneesSampleSize);
            }
            if (assignees.length > 0) {
                if (global_1.GlobalConfig.get('dryRun')) {
                    logger_1.logger.info(`DRY-RUN: Would add assignees to PR #${pr.number}`);
                }
                else {
                    await platform_1.platform.addAssignees(pr.number, assignees);
                    logger_1.logger.debug({ assignees }, 'Added assignees');
                }
            }
        }
        catch (err) {
            logger_1.logger.debug({ assignees: config.assignees, err }, 'Failed to add assignees');
        }
    }
    let reviewers = config.reviewers ?? [];
    if (config.reviewersFromCodeOwners) {
        reviewers = await addCodeOwners(reviewers, pr);
    }
    if (is_1.default.array(config.additionalReviewers) &&
        config.additionalReviewers.length > 0) {
        reviewers = reviewers.concat(config.additionalReviewers);
    }
    if (reviewers.length > 0) {
        try {
            reviewers = await prepareParticipants(config, reviewers);
            if (is_1.default.number(config.reviewersSampleSize)) {
                reviewers = (0, util_1.sampleSize)(reviewers, config.reviewersSampleSize);
            }
            if (reviewers.length > 0) {
                if (global_1.GlobalConfig.get('dryRun')) {
                    logger_1.logger.info(`DRY-RUN: Would add reviewers to PR #${pr.number}`);
                }
                else {
                    await platform_1.platform.addReviewers(pr.number, reviewers);
                    logger_1.logger.debug({ reviewers }, 'Added reviewers');
                }
            }
        }
        catch (err) {
            logger_1.logger.debug({ reviewers: config.reviewers, err }, 'Failed to add reviewers');
        }
    }
}
exports.addParticipants = addParticipants;
//# sourceMappingURL=participants.js.map