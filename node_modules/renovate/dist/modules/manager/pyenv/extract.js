"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const docker_1 = require("../../datasource/docker");
function extractPackageFile(content) {
    const dep = {
        depName: 'python',
        currentValue: content.trim(),
        datasource: docker_1.DockerDatasource.id,
    };
    return { deps: [dep] };
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map