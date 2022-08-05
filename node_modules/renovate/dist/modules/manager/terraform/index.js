"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportsLockFileMaintenance = exports.supportedDatasources = exports.extractPackageFile = exports.updateArtifacts = void 0;
const tslib_1 = require("tslib");
const bitbucket_tags_1 = require("../../datasource/bitbucket-tags");
const git_tags_1 = require("../../datasource/git-tags");
const github_releases_1 = require("../../datasource/github-releases");
const github_tags_1 = require("../../datasource/github-tags");
const helm_1 = require("../../datasource/helm");
const terraform_module_1 = require("../../datasource/terraform-module");
const terraform_provider_1 = require("../../datasource/terraform-provider");
const hashicorpVersioning = tslib_1.__importStar(require("../../versioning/hashicorp"));
var lockfile_1 = require("./lockfile");
Object.defineProperty(exports, "updateArtifacts", { enumerable: true, get: function () { return lockfile_1.updateArtifacts; } });
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.supportedDatasources = [
    bitbucket_tags_1.BitBucketTagsDatasource.id,
    git_tags_1.GitTagsDatasource.id,
    github_tags_1.GithubTagsDatasource.id,
    github_releases_1.GithubReleasesDatasource.id,
    helm_1.HelmDatasource.id,
    terraform_module_1.TerraformModuleDatasource.id,
    terraform_provider_1.TerraformProviderDatasource.id,
];
exports.supportsLockFileMaintenance = true;
exports.defaultConfig = {
    commitMessageTopic: 'Terraform {{managerData.terraformDependencyType}} {{depName}}',
    fileMatch: ['\\.tf$'],
    versioning: hashicorpVersioning.id,
    pinDigests: false,
};
//# sourceMappingURL=index.js.map