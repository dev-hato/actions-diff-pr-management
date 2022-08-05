"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const cdnjs_1 = require("../../datasource/cdnjs");
const semverVersioning = tslib_1.__importStar(require("../../versioning/semver"));
const extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.defaultConfig = {
    fileMatch: [],
    versioning: semverVersioning.id,
};
exports.supportedDatasources = [cdnjs_1.CdnJsDatasource.id];
//# sourceMappingURL=index.js.map