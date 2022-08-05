"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const azure = tslib_1.__importStar(require("./azure"));
const bitbucket = tslib_1.__importStar(require("./bitbucket"));
const bitbucketServer = tslib_1.__importStar(require("./bitbucket-server"));
const gitea = tslib_1.__importStar(require("./gitea"));
const github = tslib_1.__importStar(require("./github"));
const gitlab = tslib_1.__importStar(require("./gitlab"));
const api = new Map();
exports.default = api;
api.set('azure', azure);
api.set('bitbucket', bitbucket);
api.set('bitbucket-server', bitbucketServer);
api.set('gitea', gitea);
api.set('github', github);
api.set('gitlab', gitlab);
//# sourceMappingURL=api.js.map