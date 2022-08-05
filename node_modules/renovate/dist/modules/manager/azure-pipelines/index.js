"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const git_tags_1 = require("../../datasource/git-tags");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    fileMatch: ['azure.*pipelines?.*\\.ya?ml$'],
};
exports.supportedDatasources = [git_tags_1.GitTagsDatasource.id];
//# sourceMappingURL=index.js.map