"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const gitlab_tags_1 = require("../../datasource/gitlab-tags");
const extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    fileMatch: ['\\.gitlab-ci\\.yml$'],
};
exports.supportedDatasources = [gitlab_tags_1.GitlabTagsDatasource.id];
//# sourceMappingURL=index.js.map