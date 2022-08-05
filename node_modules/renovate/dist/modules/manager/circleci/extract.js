"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const orb_1 = require("../../datasource/orb");
const npmVersioning = tslib_1.__importStar(require("../../versioning/npm"));
const extract_1 = require("../dockerfile/extract");
function extractPackageFile(content) {
    const deps = [];
    try {
        const lines = content.split(regex_1.newlineRegex);
        for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
            const line = lines[lineNumber];
            const orbs = (0, regex_1.regEx)(/^\s*orbs:\s*$/).exec(line);
            if (orbs) {
                logger_1.logger.trace(`Matched orbs on line ${lineNumber}`);
                let foundOrbOrNoop;
                do {
                    foundOrbOrNoop = false;
                    const orbLine = lines[lineNumber + 1];
                    logger_1.logger.trace(`orbLine: "${orbLine}"`);
                    const yamlNoop = (0, regex_1.regEx)(/^\s*(#|$)/).exec(orbLine);
                    if (yamlNoop) {
                        logger_1.logger.debug('orbNoop');
                        foundOrbOrNoop = true;
                        lineNumber += 1;
                        continue;
                    }
                    const orbMatch = (0, regex_1.regEx)(/^\s+([^:]+):\s(.+)$/).exec(orbLine);
                    if (orbMatch) {
                        logger_1.logger.trace('orbMatch');
                        foundOrbOrNoop = true;
                        lineNumber += 1;
                        const depName = orbMatch[1];
                        const [orbName, currentValue] = orbMatch[2].split('@');
                        const dep = {
                            depType: 'orb',
                            depName,
                            currentValue,
                            datasource: orb_1.OrbDatasource.id,
                            packageName: orbName,
                            commitMessageTopic: '{{{depName}}} orb',
                            versioning: npmVersioning.id,
                            rangeStrategy: 'pin',
                        };
                        deps.push(dep);
                    }
                } while (foundOrbOrNoop);
            }
            const match = (0, regex_1.regEx)(/^\s*-? image:\s*'?"?([^\s'"]+)'?"?\s*$/).exec(line);
            if (match) {
                const currentFrom = match[1];
                const dep = (0, extract_1.getDep)(currentFrom);
                logger_1.logger.debug({
                    depName: dep.depName,
                    currentValue: dep.currentValue,
                    currentDigest: dep.currentDigest,
                }, 'CircleCI docker image');
                dep.depType = 'docker';
                dep.versioning = 'docker';
                if (!dep.depName?.startsWith('ubuntu-') &&
                    !dep.depName?.startsWith('windows-server-') &&
                    !dep.depName?.startsWith('android-') &&
                    dep.depName !== 'android') {
                    deps.push(dep);
                }
            }
        }
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.warn({ err }, 'Error extracting circleci images');
    }
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map