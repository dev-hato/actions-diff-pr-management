"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getControls = void 0;
const emoji_1 = require("../../../../../util/emoji");
const git_1 = require("../../../../../util/git");
async function getControls(config) {
    const warning = (await (0, git_1.isBranchModified)(config.branchName))
        ? (0, emoji_1.emojify)(' :warning: **Warning**: custom changes will be lost.')
        : '';
    return `\n\n---\n\n - [ ] <!-- rebase-check -->If you want to rebase/retry this PR, click this checkbox.${warning}\n\n`;
}
exports.getControls = getControls;
//# sourceMappingURL=controls.js.map