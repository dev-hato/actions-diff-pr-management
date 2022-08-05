"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePreset = exports.fetchPreset = exports.PRESET_RENOVATE_CONFIG_NOT_FOUND = exports.PRESET_PROHIBITED_SUBPRESET = exports.PRESET_NOT_FOUND = exports.PRESET_INVALID_JSON = exports.PRESET_INVALID = exports.PRESET_DEP_NOT_FOUND = void 0;
const tslib_1 = require("tslib");
const json5_1 = tslib_1.__importDefault(require("json5"));
const logger_1 = require("../../logger");
const regex_1 = require("../../util/regex");
const url_1 = require("../../util/url");
exports.PRESET_DEP_NOT_FOUND = 'dep not found';
exports.PRESET_INVALID = 'invalid preset';
exports.PRESET_INVALID_JSON = 'invalid preset JSON';
exports.PRESET_NOT_FOUND = 'preset not found';
exports.PRESET_PROHIBITED_SUBPRESET = 'prohibited sub-preset';
exports.PRESET_RENOVATE_CONFIG_NOT_FOUND = 'preset renovate-config not found';
async function fetchPreset({ repo, filePreset, presetPath, endpoint: _endpoint, tag = null, fetch, }) {
    // TODO: fix me, can be undefiend #7154
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const endpoint = (0, url_1.ensureTrailingSlash)(_endpoint);
    const [fileName, presetName, subPresetName] = filePreset.split('/');
    const pathPrefix = presetPath ? `${presetPath}/` : '';
    const buildFilePath = (name) => `${pathPrefix}${name}`;
    let jsonContent;
    if (fileName === 'default') {
        try {
            jsonContent = await fetch(repo, buildFilePath('default.json'), endpoint, tag);
        }
        catch (err) {
            if (err.message !== exports.PRESET_DEP_NOT_FOUND) {
                throw err;
            }
            jsonContent = await fetch(repo, buildFilePath('renovate.json'), endpoint, tag);
            logger_1.logger.info('Fallback to renovate.json file as a preset is deprecated, please use a default.json file instead.');
        }
    }
    else {
        jsonContent = await fetch(repo, buildFilePath((0, regex_1.regEx)(/\.json5?$/).test(fileName) ? fileName : `${fileName}.json`), endpoint, tag);
    }
    if (!jsonContent) {
        throw new Error(exports.PRESET_DEP_NOT_FOUND);
    }
    if (presetName) {
        const preset = jsonContent[presetName];
        if (!preset) {
            throw new Error(exports.PRESET_NOT_FOUND);
        }
        if (subPresetName) {
            const subPreset = preset[subPresetName];
            if (!subPreset) {
                throw new Error(exports.PRESET_NOT_FOUND);
            }
            return subPreset;
        }
        return preset;
    }
    return jsonContent;
}
exports.fetchPreset = fetchPreset;
function parsePreset(content) {
    try {
        return json5_1.default.parse(content);
    }
    catch (err) {
        throw new Error(exports.PRESET_INVALID_JSON);
    }
}
exports.parsePreset = parsePreset;
//# sourceMappingURL=util.js.map