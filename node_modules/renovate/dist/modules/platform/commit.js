"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitAndPush = void 0;
const git_1 = require("../../util/git");
const _1 = require(".");
function commitAndPush(commitConfig) {
    return commitConfig.platformCommit && _1.platform.commitFiles
        ? _1.platform.commitFiles(commitConfig)
        : (0, git_1.commitFiles)(commitConfig);
}
exports.commitAndPush = commitAndPush;
//# sourceMappingURL=commit.js.map