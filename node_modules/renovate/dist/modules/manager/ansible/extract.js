"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const regex_1 = require("../../../util/regex");
const dockerVersioning = tslib_1.__importStar(require("../../versioning/docker"));
const extract_1 = require("../dockerfile/extract");
function extractPackageFile(content) {
    logger_1.logger.trace('ansible.extractPackageFile()');
    let deps = [];
    const re = (0, regex_1.regEx)(/^\s*image:\s*'?"?([^\s'"]+)'?"?\s*$/);
    for (const line of content.split(regex_1.newlineRegex)) {
        const match = re.exec(line);
        if (match) {
            const currentFrom = match[1];
            const dep = (0, extract_1.getDep)(currentFrom);
            logger_1.logger.debug({
                depName: dep.depName,
                currentValue: dep.currentValue,
                currentDigest: dep.currentDigest,
            }, 'Docker image inside ansible');
            dep.versioning = dockerVersioning.id;
            deps.push(dep);
        }
    }
    deps = deps.filter((dep) => !dep.currentValue?.includes('${'));
    if (!deps.length) {
        return null;
    }
    return { deps };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map