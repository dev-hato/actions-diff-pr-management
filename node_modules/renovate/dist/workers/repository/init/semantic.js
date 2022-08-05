"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectSemanticCommits = void 0;
const tslib_1 = require("tslib");
const conventional_commits_detector_1 = tslib_1.__importDefault(require("conventional-commits-detector"));
const logger_1 = require("../../../logger");
const repository_1 = require("../../../util/cache/repository");
const git_1 = require("../../../util/git");
async function detectSemanticCommits() {
    logger_1.logger.debug('detectSemanticCommits()');
    const cache = (0, repository_1.getCache)();
    if (cache.semanticCommits) {
        return cache.semanticCommits;
    }
    const commitMessages = await (0, git_1.getCommitMessages)();
    logger_1.logger.trace(`commitMessages=${JSON.stringify(commitMessages)}`);
    const type = (0, conventional_commits_detector_1.default)(commitMessages);
    logger_1.logger.debug('Semantic commits detection: ' + type);
    if (type === 'angular') {
        logger_1.logger.debug('angular semantic commits detected');
        cache.semanticCommits = 'enabled';
    }
    else {
        logger_1.logger.debug('No semantic commits detected');
        cache.semanticCommits = 'disabled';
    }
    return cache.semanticCommits;
}
exports.detectSemanticCommits = detectSemanticCommits;
//# sourceMappingURL=semantic.js.map