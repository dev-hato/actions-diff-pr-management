"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const github_releases_1 = require("../../datasource/github-releases");
const hashicorpVersioning = tslib_1.__importStar(require("../../versioning/hashicorp"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.supportedDatasources = [github_releases_1.GithubReleasesDatasource.id];
exports.defaultConfig = {
    fileMatch: ['(^|/)\\.terragrunt-version$'],
    versioning: hashicorpVersioning.id,
    extractVersion: '^v(?<version>.+)$',
};
//# sourceMappingURL=index.js.map