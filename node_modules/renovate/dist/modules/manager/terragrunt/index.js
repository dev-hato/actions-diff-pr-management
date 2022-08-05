"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const git_tags_1 = require("../../datasource/git-tags");
const github_tags_1 = require("../../datasource/github-tags");
const terraform_module_1 = require("../../datasource/terraform-module");
const hashicorpVersioning = tslib_1.__importStar(require("../../versioning/hashicorp"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.supportedDatasources = [
    git_tags_1.GitTagsDatasource.id,
    github_tags_1.GithubTagsDatasource.id,
    terraform_module_1.TerraformModuleDatasource.id,
];
exports.defaultConfig = {
    commitMessageTopic: 'Terragrunt dependency {{depName}}',
    fileMatch: ['(^|/)terragrunt\\.hcl$'],
    versioning: hashicorpVersioning.id,
};
//# sourceMappingURL=index.js.map