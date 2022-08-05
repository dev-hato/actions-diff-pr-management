"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const github_tags_1 = require("../../datasource/github-tags");
const extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    fileMatch: ['buildkite\\.ya?ml', '\\.buildkite/.+\\.ya?ml$'],
    commitMessageTopic: 'buildkite plugin {{depName}}',
    commitMessageExtra: 'to {{#if isMajor}}v{{{newMajor}}}{{else}}{{{newValue}}}{{/if}}',
};
exports.supportedDatasources = [github_tags_1.GithubTagsDatasource.id];
//# sourceMappingURL=index.js.map