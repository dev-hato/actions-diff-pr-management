"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreset = exports.getPresetFromEndpoint = exports.fetchJSONFile = exports.Endpoint = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const logger_1 = require("../../../logger");
const external_host_error_1 = require("../../../types/errors/external-host-error");
const github_1 = require("../../../util/http/github");
const string_1 = require("../../../util/string");
const util_1 = require("../util");
exports.Endpoint = 'https://api.github.com/';
const http = new github_1.GithubHttp();
async function fetchJSONFile(repo, fileName, endpoint, tag) {
    let ref = '';
    if (is_1.default.nonEmptyString(tag)) {
        ref = `?ref=${tag}`;
    }
    const url = `${endpoint}repos/${repo}/contents/${fileName}${ref}`;
    logger_1.logger.trace({ url }, `Preset URL`);
    let res;
    try {
        res = await http.getJson(url);
    }
    catch (err) {
        // istanbul ignore if: not testable with nock
        if (err instanceof external_host_error_1.ExternalHostError) {
            throw err;
        }
        logger_1.logger.debug({ statusCode: err.statusCode, url }, `Failed to retrieve ${fileName} from repo`);
        throw new Error(util_1.PRESET_DEP_NOT_FOUND);
    }
    return (0, util_1.parsePreset)((0, string_1.fromBase64)(res.body.content));
}
exports.fetchJSONFile = fetchJSONFile;
function getPresetFromEndpoint(repo, filePreset, presetPath, endpoint = exports.Endpoint, tag) {
    return (0, util_1.fetchPreset)({
        repo,
        filePreset,
        presetPath,
        endpoint,
        tag,
        fetch: fetchJSONFile,
    });
}
exports.getPresetFromEndpoint = getPresetFromEndpoint;
function getPreset({ repo, presetName = 'default', presetPath, tag = undefined, }) {
    return getPresetFromEndpoint(repo, presetName, presetPath, exports.Endpoint, tag);
}
exports.getPreset = getPreset;
//# sourceMappingURL=index.js.map