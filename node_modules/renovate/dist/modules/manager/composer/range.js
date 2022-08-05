"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeStrategy = void 0;
const logger_1 = require("../../../logger");
function getRangeStrategy(config) {
    const { managerData = {}, depType, depName, currentValue, rangeStrategy, } = config;
    const { composerJsonType } = managerData;
    const isComplexRange = currentValue?.includes(' || ');
    if (rangeStrategy === 'bump' && isComplexRange) {
        logger_1.logger.debug({ currentValue }, 'Replacing bump strategy for complex range with widen');
        return 'widen';
    }
    if (rangeStrategy !== 'auto') {
        return rangeStrategy;
    }
    if (depType === 'require-dev') {
        // Always pin dev dependencies
        logger_1.logger.trace({ dependency: depName }, 'Pinning require-dev');
        return 'pin';
    }
    const isApp = composerJsonType &&
        ![
            'library',
            'metapackage',
            'composer-plugin',
            'symfony-bundle',
            'typo3-cms-extension',
        ].includes(composerJsonType);
    if (isApp && depType === 'require') {
        // Pin dependencies if it's an app/project
        logger_1.logger.trace({ dependency: depName }, 'Pinning app require');
        return 'pin';
    }
    if (isComplexRange ||
        (composerJsonType && ['typo3-cms-extension'].includes(composerJsonType))) {
        return 'widen';
    }
    return 'replace';
}
exports.getRangeStrategy = getRangeStrategy;
//# sourceMappingURL=range.js.map