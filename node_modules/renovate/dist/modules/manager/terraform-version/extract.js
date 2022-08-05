"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const logger_1 = require("../../../logger");
const github_releases_1 = require("../../datasource/github-releases");
function extractPackageFile(content) {
    logger_1.logger.trace('terraform-version.extractPackageFile()');
    const dep = {
        depName: 'hashicorp/terraform',
        currentValue: content.trim(),
        datasource: github_releases_1.GithubReleasesDatasource.id,
    };
    return { deps: [dep] };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map