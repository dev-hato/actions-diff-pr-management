"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const logger_1 = require("../../../logger");
const ruby_version_1 = require("../../datasource/ruby-version");
function extractPackageFile(content) {
    logger_1.logger.trace('ruby-version.extractPackageFile()');
    const dep = {
        depName: 'ruby',
        currentValue: content.trim(),
        datasource: ruby_version_1.RubyVersionDatasource.id,
    };
    return { deps: [dep] };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map