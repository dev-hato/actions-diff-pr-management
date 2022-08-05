"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const github_tags_1 = require("../../datasource/github-tags");
const dockerVersioning = tslib_1.__importStar(require("../../versioning/docker"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    fileMatch: [
        '^(workflow-templates|\\.github\\/workflows)\\/[^/]+\\.ya?ml$',
        '(^|\\/)action\\.ya?ml$',
    ],
};
exports.supportedDatasources = [
    github_tags_1.GithubTagsDatasource.id,
    dockerVersioning.id,
];
//# sourceMappingURL=index.js.map