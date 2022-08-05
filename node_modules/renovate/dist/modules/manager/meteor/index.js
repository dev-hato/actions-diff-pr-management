"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.language = exports.extractPackageFile = void 0;
const constants_1 = require("../../../constants");
const npm_1 = require("../../datasource/npm");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.language = constants_1.ProgrammingLanguage.JavaScript;
exports.defaultConfig = {
    fileMatch: ['(^|/)package.js$'],
};
exports.supportedDatasources = [npm_1.NpmDatasource.id];
//# sourceMappingURL=index.js.map