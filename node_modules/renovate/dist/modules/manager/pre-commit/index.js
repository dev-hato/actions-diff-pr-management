"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.extractPackageFile = void 0;
const github_tags_1 = require("../../datasource/github-tags");
const gitlab_tags_1 = require("../../datasource/gitlab-tags");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.supportedDatasources = [
    github_tags_1.GithubTagsDatasource.id,
    gitlab_tags_1.GitlabTagsDatasource.id,
];
exports.defaultConfig = {
    commitMessageTopic: 'pre-commit hook {{depName}}',
    enabled: false,
    fileMatch: ['(^|/)\\.pre-commit-config\\.yaml$'],
    prBodyNotes: [
        'Note: The `pre-commit` manager in Renovate is not supported by the `pre-commit` maintainers or community. Please do not report any problems there, instead [create a Discussion in the Renovate repository](https://github.com/renovatebot/renovate/discussions/new) if you have any questions.',
    ],
};
//# sourceMappingURL=index.js.map