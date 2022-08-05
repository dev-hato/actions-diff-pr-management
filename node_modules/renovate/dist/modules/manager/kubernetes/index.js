"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.language = exports.extractPackageFile = void 0;
const constants_1 = require("../../../constants");
const docker_1 = require("../../datasource/docker");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.language = constants_1.ProgrammingLanguage.Docker;
exports.defaultConfig = {
    fileMatch: [],
};
exports.supportedDatasources = [docker_1.DockerDatasource.id];
//# sourceMappingURL=index.js.map