"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const docker_1 = require("../../datasource/docker");
const git_tags_1 = require("../../datasource/git-tags");
const github_tags_1 = require("../../datasource/github-tags");
const helm_1 = require("../../datasource/helm");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    fileMatch: ['(^|/)kustomization\\.ya?ml$'],
    pinDigests: false,
};
exports.supportedDatasources = [
    docker_1.DockerDatasource.id,
    git_tags_1.GitTagsDatasource.id,
    github_tags_1.GithubTagsDatasource.id,
    helm_1.HelmDatasource.id,
];
//# sourceMappingURL=index.js.map