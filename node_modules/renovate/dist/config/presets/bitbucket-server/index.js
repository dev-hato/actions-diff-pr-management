"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresetFromEndpoint = exports.fetchJSONFile = void 0;
const logger_1 = require("../../../logger");
const external_host_error_1 = require("../../../types/errors/external-host-error");
const bitbucket_server_1 = require("../../../util/http/bitbucket-server");
const util_1 = require("../util");
const http = new bitbucket_server_1.BitbucketServerHttp();
async function fetchJSONFile(repo, fileName, endpoint, branchOrTag) {
    const [projectKey, repositorySlug] = repo.split('/');
    (0, bitbucket_server_1.setBaseUrl)(endpoint);
    let url = `rest/api/1.0/projects/${projectKey}/repos/${repositorySlug}/browse/${fileName}?limit=20000`;
    if (branchOrTag) {
        url += '&at=' + encodeURIComponent(branchOrTag);
    }
    let res;
    try {
        res = await http.getJson(url);
    }
    catch (err) {
        // istanbul ignore if: not testable with nock
        if (err instanceof external_host_error_1.ExternalHostError) {
            throw err;
        }
        logger_1.logger.debug({ statusCode: err.statusCode, url: `${endpoint}${url}` }, `Failed to retrieve ${fileName} from repo`);
        throw new Error(util_1.PRESET_DEP_NOT_FOUND);
    }
    if (!res.body.isLastPage) {
        logger_1.logger.warn({ size: res.body.size }, 'Renovate config to big');
        throw new Error(util_1.PRESET_INVALID_JSON);
    }
    return (0, util_1.parsePreset)(res.body.lines.map((l) => l.text).join(''));
}
exports.fetchJSONFile = fetchJSONFile;
function getPresetFromEndpoint(repo, filePreset, presetPath, endpoint, tag) {
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
//# sourceMappingURL=index.js.map