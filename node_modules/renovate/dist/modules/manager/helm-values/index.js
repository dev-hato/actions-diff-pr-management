"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const docker_1 = require("../../datasource/docker");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    commitMessageTopic: 'helm values {{depName}}',
    fileMatch: ['(^|/)values.yaml$'],
    pinDigests: false,
};
exports.supportedDatasources = [docker_1.DockerDatasource.id];
//# sourceMappingURL=index.js.map