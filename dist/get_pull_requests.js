"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequests = void 0;
function getPullRequests(github, context, base) {
    return __awaiter(this, void 0, void 0, function* () {
        const HEAD_REF = process.env.HEAD_REF;
        let head = context.repo.owner + ":" + process.env.BRANCH_NAME_PREFIX;
        if (HEAD_REF !== "") {
            head += "-" + HEAD_REF;
        }
        const pullsListParams = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            head,
            state: "open",
            base,
        };
        console.log("call pulls.list:", pullsListParams);
        return yield github.paginate(github.rest.pulls.list, pullsListParams);
    });
}
exports.getPullRequests = getPullRequests;
