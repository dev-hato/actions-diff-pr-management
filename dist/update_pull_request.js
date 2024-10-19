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
const generate_title_description_1 = require("./generate_title_description");
const get_pull_requests_1 = require("./get_pull_requests");
function script(github, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, body } = (0, generate_title_description_1.generateTitleDescription)();
        for (const pull of yield (0, get_pull_requests_1.getPullRequests)(github, context)) {
            if (pull.title === title && pull.body === body) {
                continue;
            }
            // PRのタイトルやDescriptionを更新する
            const pullsUpdateParams = {
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: pull.number,
                title,
                body,
            };
            console.log("call pulls.update:", pullsUpdateParams);
            yield github.rest.pulls.update(pullsUpdateParams);
        }
    });
}
exports.script = script;
