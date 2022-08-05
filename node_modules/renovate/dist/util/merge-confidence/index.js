"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMergeConfidenceLevel = exports.satisfiesConfidenceLevel = exports.isActiveConfidenceLevel = exports.confidenceLevels = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../logger");
const memCache = tslib_1.__importStar(require("../cache/memory"));
const packageCache = tslib_1.__importStar(require("../cache/package"));
const hostRules = tslib_1.__importStar(require("../host-rules"));
const http_1 = require("../http");
const http = new http_1.Http('merge-confidence');
const MERGE_CONFIDENCE = ['low', 'neutral', 'high', 'very high'];
exports.confidenceLevels = {
    low: -1,
    neutral: 0,
    high: 1,
    'very high': 2,
};
function isActiveConfidenceLevel(confidence) {
    return confidence !== 'low' && MERGE_CONFIDENCE.includes(confidence);
}
exports.isActiveConfidenceLevel = isActiveConfidenceLevel;
function satisfiesConfidenceLevel(confidence, minimumConfidence) {
    return exports.confidenceLevels[confidence] >= exports.confidenceLevels[minimumConfidence];
}
exports.satisfiesConfidenceLevel = satisfiesConfidenceLevel;
const updateTypeConfidenceMapping = {
    pin: 'high',
    digest: 'neutral',
    pinDigest: 'high',
    bump: 'neutral',
    lockFileMaintenance: 'neutral',
    lockfileUpdate: 'neutral',
    rollback: 'neutral',
    replacement: 'neutral',
    major: null,
    minor: null,
    patch: null,
};
async function getMergeConfidenceLevel(datasource, depName, currentVersion, newVersion, updateType) {
    if (!(currentVersion && newVersion && updateType)) {
        return 'neutral';
    }
    const mappedConfidence = updateTypeConfidenceMapping[updateType];
    if (mappedConfidence) {
        return mappedConfidence;
    }
    const { token } = hostRules.find({
        hostType: 'merge-confidence',
        url: 'https://badges.renovateapi.com',
    });
    if (!token) {
        logger_1.logger.warn('No Merge Confidence API token found');
        return 'neutral';
    }
    // istanbul ignore if
    if (memCache.get('merge-confidence-invalid-token')) {
        return 'neutral';
    }
    const url = `https://badges.renovateapi.com/packages/${datasource}/${depName}/${newVersion}/confidence.api/${currentVersion}`;
    const cachedResult = await packageCache.get('merge-confidence', token + url);
    // istanbul ignore if
    if (cachedResult) {
        return cachedResult;
    }
    let confidence = 'neutral';
    try {
        const res = (await http.getJson(url)).body;
        if (MERGE_CONFIDENCE.includes(res.confidence)) {
            confidence = res.confidence;
        }
    }
    catch (err) {
        logger_1.logger.debug({ err }, 'Error fetching merge confidence');
        if (err.statusCode === 403) {
            memCache.set('merge-confidence-invalid-token', true);
            logger_1.logger.warn('Merge Confidence API token rejected');
        }
    }
    await packageCache.set('merge-confidence', token + url, confidence, 60);
    return confidence;
}
exports.getMergeConfidenceLevel = getMergeConfidenceLevel;
//# sourceMappingURL=index.js.map