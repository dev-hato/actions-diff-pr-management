"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractPackageFile", { enumerable: true, get: function () { return extract_1.extractPackageFile; } });
const conan_1 = require("../../datasource/conan");
const conan = tslib_1.__importStar(require("../../versioning/conan"));
exports.defaultConfig = {
    fileMatch: ['(^|/)conanfile\\.(txt|py)$'],
    datasource: conan_1.ConanDatasource.id,
    versioning: conan.id,
    rangeStrategy: 'bump',
    enabled: false, // See https://github.com/renovatebot/renovate/issues/14170
};
exports.supportedDatasources = [conan_1.ConanDatasource.id];
//# sourceMappingURL=index.js.map