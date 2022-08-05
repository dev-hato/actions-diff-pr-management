"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.language = exports.updateArtifacts = exports.extractPackageFile = void 0;
const constants_1 = require("../../../constants");
const nuget_1 = require("../../datasource/nuget");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
var artifacts_1 = require("./artifacts");
Object.defineProperty(exports, "updateArtifacts", { enumerable: true, get: function () { return artifacts_1.updateArtifacts; } });
exports.language = constants_1.ProgrammingLanguage.NET;
exports.defaultConfig = {
    fileMatch: [
        '\\.(?:cs|fs|vb)proj$',
        '\\.(?:props|targets)$',
        '(^|\\/)dotnet-tools\\.json$',
        '(^|\\/)global\\.json$',
    ],
};
exports.supportedDatasources = [nuget_1.NugetDatasource.id];
//# sourceMappingURL=index.js.map