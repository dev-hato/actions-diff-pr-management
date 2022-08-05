"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const github_tags_1 = require("../../datasource/github-tags");
function extractPackageFile(content) {
    const dep = {
        depName: 'node',
        currentValue: content.trim(),
        datasource: github_tags_1.GithubTagsDatasource.id,
        packageName: 'nodejs/node',
    };
    return { deps: [dep] };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map