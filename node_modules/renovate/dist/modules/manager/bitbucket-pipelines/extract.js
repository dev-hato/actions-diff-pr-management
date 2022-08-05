"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const extract_1 = require("../dockerfile/extract");
const pipeRegex = (0, regex_1.regEx)(`^\\s*-\\s?pipe:\\s*'?"?([^\\s'"]+)'?"?\\s*$`);
const dockerImageRegex = (0, regex_1.regEx)(`^\\s*-?\\s?image:\\s*'?"?([^\\s'"]+)'?"?\\s*$`);
function extractPackageFile(content) {
    const deps = [];
    try {
        const lines = content.split(regex_1.newlineRegex);
        for (const line of lines) {
            const pipeMatch = pipeRegex.exec(line);
            if (pipeMatch) {
                const pipe = pipeMatch[1];
                const [depName, currentValue] = pipe.split(':');
                const dep = {
                    depName,
                    currentValue,
                    datasource: 'bitbucket-tags',
                };
                logger_1.logger.trace({
                    depName: dep.depName,
                    currentValue: dep.currentValue,
                }, 'Bitbucket pipe');
                dep.depType = 'bitbucket-tags';
                deps.push(dep);
            }
            const dockerImageMatch = dockerImageRegex.exec(line);
            if (dockerImageMatch) {
                const currentFrom = dockerImageMatch[1];
                const dep = (0, extract_1.getDep)(currentFrom);
                logger_1.logger.trace({
                    depName: dep.depName,
                    currentValue: dep.currentValue,
                    currentDigest: dep.currentDigest,
                }, 'Docker image');
                dep.depType = 'docker';
                deps.push(dep);
            }
        }
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.warn({ err }, 'Error extracting Bitbucket Pipes dependencies');
    }
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map