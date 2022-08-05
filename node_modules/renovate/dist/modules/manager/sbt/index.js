"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.bumpPackageVersion = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const maven_1 = require("../../datasource/maven");
const sbt_package_1 = require("../../datasource/sbt-package");
const sbt_plugin_1 = require("../../datasource/sbt-plugin");
const ivyVersioning = tslib_1.__importStar(require("../../versioning/ivy"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var update_1 = require("./update");
Object.defineProperty(exports, "bumpPackageVersion", { enumerable: true, get: function () { return update_1.bumpPackageVersion; } });
exports.supportedDatasources = [
    maven_1.MavenDatasource.id,
    sbt_package_1.SbtPackageDatasource.id,
    sbt_plugin_1.SbtPluginDatasource.id,
];
exports.defaultConfig = {
    fileMatch: ['\\.sbt$', 'project/[^/]*.scala$'],
    versioning: ivyVersioning.id,
};
//# sourceMappingURL=index.js.map