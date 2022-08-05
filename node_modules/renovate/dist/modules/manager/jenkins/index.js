"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const jenkins_plugins_1 = require("../../datasource/jenkins-plugins");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    fileMatch: ['(^|/)plugins\\.(txt|ya?ml)$'],
};
exports.supportedDatasources = [jenkins_plugins_1.JenkinsPluginsDatasource.id];
//# sourceMappingURL=index.js.map