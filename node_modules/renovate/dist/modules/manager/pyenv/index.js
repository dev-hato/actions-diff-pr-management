"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.language = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../../constants");
const docker_1 = require("../../datasource/docker");
const dockerVersioning = tslib_1.__importStar(require("../../versioning/docker"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.language = constants_1.ProgrammingLanguage.Python;
exports.supportedDatasources = [docker_1.DockerDatasource.id];
exports.defaultConfig = {
    fileMatch: ['(^|/).python-version$'],
    versioning: dockerVersioning.id,
};
//# sourceMappingURL=index.js.map