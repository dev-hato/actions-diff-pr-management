"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.language = exports.updateArtifacts = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../../constants");
const hex_1 = require("../../datasource/hex");
const hexVersioning = tslib_1.__importStar(require("../../versioning/hex"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var artifacts_1 = require("./artifacts");
Object.defineProperty(exports, "updateArtifacts", { enumerable: true, get: function () { return artifacts_1.updateArtifacts; } });
exports.language = constants_1.ProgrammingLanguage.Elixir;
exports.defaultConfig = {
    fileMatch: ['(^|/)mix\\.exs$'],
    versioning: hexVersioning.id,
};
exports.supportedDatasources = [hex_1.HexDatasource.id];
//# sourceMappingURL=index.js.map