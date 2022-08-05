"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportsLockFileMaintenance = exports.language = exports.supportedDatasources = exports.updateLockedDependency = exports.updateArtifacts = exports.extractPackageFile = void 0;
const constants_1 = require("../../../constants");
const pypi_1 = require("../../datasource/pypi");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var artifacts_1 = require("./artifacts");
Object.defineProperty(exports, "updateArtifacts", { enumerable: true, get: function () { return artifacts_1.updateArtifacts; } });
var update_locked_1 = require("./update-locked");
Object.defineProperty(exports, "updateLockedDependency", { enumerable: true, get: function () { return update_locked_1.updateLockedDependency; } });
exports.supportedDatasources = [pypi_1.PypiDatasource.id];
exports.language = constants_1.ProgrammingLanguage.Python;
exports.supportsLockFileMaintenance = true;
exports.defaultConfig = {
    fileMatch: ['(^|/)pyproject\\.toml$'],
};
//# sourceMappingURL=index.js.map