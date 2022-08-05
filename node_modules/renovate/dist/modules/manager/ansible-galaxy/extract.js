"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = exports.getSliceEndNumber = void 0;
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const collections_1 = require("./collections");
const collections_metadata_1 = require("./collections-metadata");
const roles_1 = require("./roles");
function getSliceEndNumber(start, numberOfLines, ...blocks) {
    if (start < 0 || start > numberOfLines - 1) {
        return -1;
    }
    let nearestEnd = numberOfLines - 1;
    for (const blocksKey of blocks) {
        if (start < blocksKey && blocksKey < nearestEnd) {
            nearestEnd = blocksKey;
        }
    }
    return nearestEnd;
}
exports.getSliceEndNumber = getSliceEndNumber;
function extractPackageFile(content, fileName) {
    logger_1.logger.trace('ansible-galaxy.extractPackageFile()');
    const galaxyFileNameRegEx = (0, regex_1.regEx)(/galaxy\.ya?ml$/);
    const deps = [];
    const lines = content.split(regex_1.newlineRegex);
    try {
        // if this is a galaxy.yml file we have to interpret the dependencies differently
        if (galaxyFileNameRegEx.exec(fileName)) {
            const galaxyDeps = (0, collections_metadata_1.extractCollectionsMetaDataFile)(lines);
            deps.push(...galaxyDeps);
        }
        else {
            // interpret requirements file
            // check if new or old format is used and save start lines for collection and roles.
            const positions = {
                collections: -1,
                roles: -1,
            };
            // find role and collection block
            lines.forEach((line, index) => {
                if ((0, regex_1.regEx)(/^collections:/).exec(line)) {
                    positions.collections = index;
                }
                if ((0, regex_1.regEx)(/^roles:/).exec(line)) {
                    positions.roles = index;
                }
            });
            if (positions.collections >= 0 || positions.roles >= 0) {
                // using new format
                const collectionLines = lines.slice(positions.collections, getSliceEndNumber(positions.collections, lines.length, positions.roles));
                const collectionDeps = (0, collections_1.extractCollections)(collectionLines);
                deps.push(...collectionDeps);
                const roleLines = lines.slice(positions.roles, getSliceEndNumber(positions.roles, lines.length, positions.collections));
                const roleDeps = (0, roles_1.extractRoles)(roleLines);
                deps.push(...roleDeps);
            }
            else {
                // use old format which only has only roles
                const galaxyDeps = (0, roles_1.extractRoles)(lines);
                deps.push(...galaxyDeps);
            }
        }
        if (!deps.length) {
            return null;
        }
        return { deps };
    }
    catch (err) /* istanbul ignore next */ {
        logger_1.logger.debug({ err }, 'Error extracting ansible-galaxy deps');
        return null;
    }
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map