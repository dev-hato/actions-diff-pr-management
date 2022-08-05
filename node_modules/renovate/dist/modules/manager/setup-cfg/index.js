"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.language = exports.supportedDatasources = exports.getRangeStrategy = exports.extractPackageFile = void 0;
const constants_1 = require("../../../constants");
const pypi_1 = require("../../datasource/pypi");
const pep440_1 = require("../../versioning/pep440");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var range_1 = require("./range");
Object.defineProperty(exports, "getRangeStrategy", { enumerable: true, get: function () { return range_1.getRangeStrategy; } });
exports.supportedDatasources = [pypi_1.PypiDatasource.id];
exports.language = constants_1.ProgrammingLanguage.Python;
exports.defaultConfig = {
    fileMatch: ['(^|/)setup\\.cfg$'],
    versioning: pep440_1.id,
};
//# sourceMappingURL=index.js.map