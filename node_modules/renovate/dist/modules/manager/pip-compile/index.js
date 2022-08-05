"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.supportsLockFileMaintenance = exports.language = exports.updateArtifacts = exports.extractPackageFile = void 0;
const constants_1 = require("../../../constants");
const pypi_1 = require("../../datasource/pypi");
var extract_1 = require("../pip_requirements/extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var artifacts_1 = require("./artifacts");
Object.defineProperty(exports, "updateArtifacts", { enumerable: true, get: function () { return artifacts_1.updateArtifacts; } });
exports.language = constants_1.ProgrammingLanguage.Python;
exports.supportsLockFileMaintenance = true;
exports.supportedDatasources = [pypi_1.PypiDatasource.id];
exports.defaultConfig = {
    fileMatch: [],
    lockFileMaintenance: {
        enabled: true,
        branchTopic: 'pip-compile-refresh',
        commitMessageAction: 'Refresh pip-compile outputs',
    },
};
//# sourceMappingURL=index.js.map