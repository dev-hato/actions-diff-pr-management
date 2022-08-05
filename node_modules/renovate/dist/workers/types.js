"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchResult = void 0;
// eslint-disable-next-line typescript-enum/no-enum
var BranchResult;
(function (BranchResult) {
    BranchResult["AlreadyExisted"] = "already-existed";
    BranchResult["Automerged"] = "automerged";
    BranchResult["Done"] = "done";
    BranchResult["Error"] = "error";
    BranchResult["NeedsApproval"] = "needs-approval";
    BranchResult["NeedsPrApproval"] = "needs-pr-approval";
    BranchResult["NotScheduled"] = "not-scheduled";
    BranchResult["NoWork"] = "no-work";
    BranchResult["Pending"] = "pending";
    BranchResult["PrCreated"] = "pr-created";
    BranchResult["PrEdited"] = "pr-edited";
    BranchResult["PrLimitReached"] = "pr-limit-reached";
    BranchResult["CommitLimitReached"] = "commit-limit-reached";
    BranchResult["BranchLimitReached"] = "branch-limit-reached";
    BranchResult["Rebase"] = "rebase";
    BranchResult["UpdateNotScheduled"] = "update-not-scheduled";
})(BranchResult = exports.BranchResult || (exports.BranchResult = {}));
//# sourceMappingURL=types.js.map