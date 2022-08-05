"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.language = exports.extractPackageFile = void 0;
const constants_1 = require("../../../constants");
const pypi_1 = require("../../datasource/pypi");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.language = constants_1.ProgrammingLanguage.Python;
exports.defaultConfig = {
    fileMatch: ['(^|/)setup.py$'],
};
exports.supportedDatasources = [pypi_1.PypiDatasource.id];
//# sourceMappingURL=index.js.map