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
const get_pull_requests_1 = require("./get_pull_requests");
function script(github, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const HEAD_REF = process.env.HEAD_REF;
        const pulls = yield (0, get_pull_requests_1.getPullRequests)(github, context, HEAD_REF);
        return pulls.length;
    });
}
