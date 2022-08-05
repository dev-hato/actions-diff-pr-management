"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedChangelogs = void 0;
const tslib_1 = require("tslib");
const p_map_1 = tslib_1.__importDefault(require("p-map"));
const changelog_1 = require("../update/pr/changelog");
// istanbul ignore next
async function embedChangelog(upgrade) {
    upgrade.logJSON = await (0, changelog_1.getChangeLogJSON)(upgrade);
}
// istanbul ignore next
async function embedChangelogs(branchUpgrades) {
    const upgrades = [];
    for (const branchName of Object.keys(branchUpgrades)) {
        for (const upgrade of branchUpgrades[branchName]) {
            upgrades.push(upgrade);
        }
    }
    await (0, p_map_1.default)(upgrades, embedChangelog, { concurrency: 10 });
}
exports.embedChangelogs = embedChangelogs;
//# sourceMappingURL=index.js.map