"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.supportedDatasources = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const dart_1 = require("../../datasource/dart");
const npmVersioning = tslib_1.__importStar(require("../../versioning/npm"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.supportedDatasources = [dart_1.DartDatasource.id];
exports.defaultConfig = {
    fileMatch: ['(^|/)pubspec\\.ya?ml$'],
    versioning: npmVersioning.id,
};
//# sourceMappingURL=index.js.map