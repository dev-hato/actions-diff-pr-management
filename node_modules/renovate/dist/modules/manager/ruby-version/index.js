"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.language = exports.supportedDatasources = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../../constants");
const ruby_version_1 = require("../../datasource/ruby-version");
const rubyVersioning = tslib_1.__importStar(require("../../versioning/ruby"));
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
exports.supportedDatasources = [ruby_version_1.RubyVersionDatasource.id];
exports.language = constants_1.ProgrammingLanguage.Ruby;
exports.defaultConfig = {
    fileMatch: ['(^|/)\\.ruby-version$'],
    versioning: rubyVersioning.id,
};
//# sourceMappingURL=index.js.map