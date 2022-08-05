"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.updateDependency = exports.extractPackageFile = void 0;
const docker_1 = require("../../datasource/docker");
const github_releases_1 = require("../../datasource/github-releases");
const github_tags_1 = require("../../datasource/github-tags");
const go_1 = require("../../datasource/go");
const extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
const update_1 = require("./update");
Object.defineProperty(exports, "updateDependency", { enumerable: true, get: function () { return update_1.updateDependency; } });
exports.defaultConfig = {
    fileMatch: ['(^|/)WORKSPACE(|\\.bazel)$', '\\.bzl$'],
};
exports.supportedDatasources = [
    docker_1.DockerDatasource.id,
    github_releases_1.GithubReleasesDatasource.id,
    github_tags_1.GithubTagsDatasource.id,
    go_1.GoDatasource.id,
];
//# sourceMappingURL=index.js.map