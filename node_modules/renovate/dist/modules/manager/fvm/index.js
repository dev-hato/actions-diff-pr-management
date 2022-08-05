"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const flutter_version_1 = require("../../datasource/flutter-version");
const semverVersioning = tslib_1.__importStar(require("../../versioning/semver"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.supportedDatasources = [flutter_version_1.FlutterVersionDatasource.id];
exports.defaultConfig = {
    fileMatch: ['(^|\\/)\\.fvm\\/fvm_config\\.json$'],
    versioning: semverVersioning.id,
};
//# sourceMappingURL=index.js.map