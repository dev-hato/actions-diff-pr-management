"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedDatasources = exports.defaultConfig = exports.supportsLockFileMaintenance = exports.language = exports.getRangeStrategy = exports.updateLockedDependency = exports.updateDependency = exports.bumpPackageVersion = exports.extractAllPackageFiles = exports.detectGlobalConfig = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../../constants");
const github_tags_1 = require("../../datasource/github-tags");
const npm_1 = require("../../datasource/npm");
const npmVersioning = tslib_1.__importStar(require("../../versioning/npm"));
var detect_1 = require("./detect");
Object.defineProperty(exports, "detectGlobalConfig", { enumerable: true, get: function () { return detect_1.detectGlobalConfig; } });
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractAllPackageFiles", { enumerable: true, get: function () { return extract_1.extractAllPackageFiles; } });
var update_1 = require("./update");
Object.defineProperty(exports, "bumpPackageVersion", { enumerable: true, get: function () { return update_1.bumpPackageVersion; } });
Object.defineProperty(exports, "updateDependency", { enumerable: true, get: function () { return update_1.updateDependency; } });
Object.defineProperty(exports, "updateLockedDependency", { enumerable: true, get: function () { return update_1.updateLockedDependency; } });
var range_1 = require("./range");
Object.defineProperty(exports, "getRangeStrategy", { enumerable: true, get: function () { return range_1.getRangeStrategy; } });
exports.language = constants_1.ProgrammingLanguage.JavaScript;
exports.supportsLockFileMaintenance = true;
exports.defaultConfig = {
    fileMatch: ['(^|/)package.json$'],
    rollbackPrs: true,
    versioning: npmVersioning.id,
    digest: {
        prBodyDefinitions: {
            Change: '{{#if displayFrom}}`{{{displayFrom}}}` -> {{else}}{{#if currentValue}}`{{{currentValue}}}` -> {{/if}}{{/if}}{{#if displayTo}}`{{{displayTo}}}`{{else}}`{{{newValue}}}`{{/if}}',
        },
    },
    prBodyDefinitions: {
        Change: "[{{#if displayFrom}}`{{{displayFrom}}}` -> {{else}}{{#if currentValue}}`{{{currentValue}}}` -> {{/if}}{{/if}}{{#if displayTo}}`{{{displayTo}}}`{{else}}`{{{newValue}}}`{{/if}}]({{#if depName}}https://renovatebot.com/diffs/npm/{{replace '/' '%2f' depName}}/{{{currentVersion}}}/{{{newVersion}}}{{/if}})",
    },
};
exports.supportedDatasources = [github_tags_1.GithubTagsDatasource.id, npm_1.NpmDatasource.id];
//# sourceMappingURL=index.js.map