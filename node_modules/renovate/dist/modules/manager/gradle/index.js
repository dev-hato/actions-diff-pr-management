"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.language = exports.updateDependency = exports.extractAllPackageFiles = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../../constants");
const maven_1 = require("../../datasource/maven");
const gradleVersioning = tslib_1.__importStar(require("../../versioning/gradle"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractAllPackageFiles", { enumerable: true, get: function () { return extract_1.extractAllPackageFiles; } });
var update_1 = require("./update");
Object.defineProperty(exports, "updateDependency", { enumerable: true, get: function () { return update_1.updateDependency; } });
exports.language = constants_1.ProgrammingLanguage.Java;
exports.defaultConfig = {
    fileMatch: [
        '\\.gradle(\\.kts)?$',
        '(^|\\/)gradle\\.properties$',
        '(^|\\/)gradle\\/.+\\.toml$',
        '\\.versions\\.toml$',
    ],
    timeout: 600,
    versioning: gradleVersioning.id,
};
exports.supportedDatasources = [maven_1.MavenDatasource.id];
//# sourceMappingURL=index.js.map