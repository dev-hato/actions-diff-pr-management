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
exports.script = script;
const generate_title_description_1 = require("./generate_title_description");
function script(github, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const HEAD_REF = process.env.HEAD_REF || "";
        let head = process.env.BRANCH_NAME_PREFIX;
        if (HEAD_REF !== "") {
            head += "-" + HEAD_REF;
        }
        const headWithRepo = context.repo.owner + ":" + head;
        const { title, body } = (0, generate_title_description_1.generateTitleDescription)();
        const pullsCreateParams = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            head: headWithRepo,
            base: HEAD_REF,
            title,
            body,
        };
        console.log("call pulls.create:", pullsCreateParams);
        const createPullRes = yield github.rest.pulls.create(pullsCreateParams);
        return createPullRes.data.number;
    });
}
