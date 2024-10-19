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
exports.script = void 0;
function script(github, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const issuesAddAssigneesParams = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: Number(process.env.PR_NUMBER),
            assignees: [context.actor],
        };
        console.log("call issues.addAssignees:");
        console.log(issuesAddAssigneesParams);
        yield github.rest.issues.addAssignees(issuesAddAssigneesParams);
    });
}
exports.script = script;
