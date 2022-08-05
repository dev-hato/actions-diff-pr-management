"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const logger_1 = require("../../../logger");
const flutter_version_1 = require("../../datasource/flutter-version");
function extractPackageFile(content, packageFile) {
    let fvmConfig;
    try {
        fvmConfig = JSON.parse(content);
    }
    catch (err) {
        logger_1.logger.debug({ packageFile, err }, 'Invalid FVM config');
        return null;
    }
    if (!fvmConfig.flutterSdkVersion) {
        logger_1.logger.debug({ contents: fvmConfig }, 'FVM config does not have flutterSdkVersion specified');
        return null;
    }
    else if (!is_1.default.string(fvmConfig.flutterSdkVersion)) {
        logger_1.logger.debug({ contents: fvmConfig }, 'flutterSdkVersion must be a string');
        return null;
    }
    const dep = {
        depName: 'flutter',
        currentValue: fvmConfig.flutterSdkVersion,
        datasource: flutter_version_1.FlutterVersionDatasource.id,
        packageName: 'flutter/flutter',
    };
    return { deps: [dep] };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map