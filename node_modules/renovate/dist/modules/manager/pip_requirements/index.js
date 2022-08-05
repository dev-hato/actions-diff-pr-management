"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.language = exports.getRangeStrategy = exports.extractPackageFile = exports.updateArtifacts = void 0;
const constants_1 = require("../../../constants");
const git_tags_1 = require("../../datasource/git-tags");
const pypi_1 = require("../../datasource/pypi");
var artifacts_1 = require("./artifacts");
Object.defineProperty(exports, "updateArtifacts", { enumerable: true, get: function () { return artifacts_1.updateArtifacts; } });
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var range_1 = require("./range");
Object.defineProperty(exports, "getRangeStrategy", { enumerable: true, get: function () { return range_1.getRangeStrategy; } });
exports.language = constants_1.ProgrammingLanguage.Python;
exports.defaultConfig = {
    fileMatch: ['(^|/)([\\w-]*)requirements\\.(txt|pip)$'],
};
exports.supportedDatasources = [pypi_1.PypiDatasource.id, git_tags_1.GitTagsDatasource.id];
//# sourceMappingURL=index.js.map