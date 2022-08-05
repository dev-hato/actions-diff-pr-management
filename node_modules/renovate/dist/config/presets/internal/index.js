"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreset = exports.groups = void 0;
const tslib_1 = require("tslib");
const compatibilityPreset = tslib_1.__importStar(require("./compatibility"));
const configPreset = tslib_1.__importStar(require("./config"));
const defaultPreset = tslib_1.__importStar(require("./default"));
const dockerPreset = tslib_1.__importStar(require("./docker"));
const groupPreset = tslib_1.__importStar(require("./group"));
const helpersPreset = tslib_1.__importStar(require("./helpers"));
const monorepoPreset = tslib_1.__importStar(require("./monorepo"));
const npm = tslib_1.__importStar(require("./npm"));
const packagesPreset = tslib_1.__importStar(require("./packages"));
const previewPreset = tslib_1.__importStar(require("./preview"));
const regexManagersPreset = tslib_1.__importStar(require("./regex-managers"));
const replacements = tslib_1.__importStar(require("./replacements"));
const schedulePreset = tslib_1.__importStar(require("./schedule"));
const workaroundsPreset = tslib_1.__importStar(require("./workarounds"));
exports.groups = {
    compatibility: compatibilityPreset.presets,
    config: configPreset.presets,
    default: defaultPreset.presets,
    docker: dockerPreset.presets,
    group: groupPreset.presets,
    helpers: helpersPreset.presets,
    monorepo: monorepoPreset.presets,
    npm: npm.presets,
    packages: packagesPreset.presets,
    preview: previewPreset.presets,
    regexManagers: regexManagersPreset.presets,
    replacements: replacements.presets,
    schedule: schedulePreset.presets,
    workarounds: workaroundsPreset.presets,
};
function getPreset({ repo, presetName, }) {
    return exports.groups[repo] && presetName
        ? exports.groups[repo][presetName]
        : /* istanbul ignore next */ undefined;
}
exports.getPreset = getPreset;
//# sourceMappingURL=index.js.map