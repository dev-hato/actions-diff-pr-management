"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.updateArtifacts = exports.extractPackageFile = exports.extractAllPackageFiles = void 0;
const github_releases_1 = require("../../datasource/github-releases");
const helm_1 = require("../../datasource/helm");
const common_1 = require("./common");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractAllPackageFiles", { enumerable: true, get: function () { return extract_1.extractAllPackageFiles; } });
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var artifacts_1 = require("./artifacts");
Object.defineProperty(exports, "updateArtifacts", { enumerable: true, get: function () { return artifacts_1.updateArtifacts; } });
exports.defaultConfig = {
    fileMatch: [common_1.systemManifestRegex],
};
exports.supportedDatasources = [
    github_releases_1.GithubReleasesDatasource.id,
    helm_1.HelmDatasource.id,
];
//# sourceMappingURL=index.js.map