"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzurePrVote = void 0;
// eslint-disable-next-line typescript-enum/no-enum
var AzurePrVote;
(function (AzurePrVote) {
    AzurePrVote[AzurePrVote["NoVote"] = 0] = "NoVote";
    AzurePrVote[AzurePrVote["Reject"] = -10] = "Reject";
    AzurePrVote[AzurePrVote["WaitingForAuthor"] = -5] = "WaitingForAuthor";
    AzurePrVote[AzurePrVote["ApprovedWithSuggestions"] = 5] = "ApprovedWithSuggestions";
    AzurePrVote[AzurePrVote["Approved"] = 10] = "Approved";
})(AzurePrVote = exports.AzurePrVote || (exports.AzurePrVote = {}));
//# sourceMappingURL=types.js.map