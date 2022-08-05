"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMsbuildGlobalManifest = void 0;
const logger_1 = require("../../../../logger");
const nuget_1 = require("../../../datasource/nuget");
function extractMsbuildGlobalManifest(content, packageFile) {
    const deps = [];
    let manifest;
    try {
        manifest = JSON.parse(content);
    }
    catch (err) {
        logger_1.logger.debug({ fileName: packageFile }, 'Invalid JSON');
        return null;
    }
    if (!manifest['msbuild-sdks'] && !manifest.sdk?.version) {
        logger_1.logger.debug({ fileName: packageFile }, 'This global.json is not a Nuget file');
        return null;
    }
    if (manifest.sdk?.version) {
        deps.push({
            depType: 'dotnet-sdk',
            depName: 'dotnet-sdk',
            currentValue: manifest.sdk?.version,
            skipReason: 'unsupported-datasource',
        });
    }
    if (manifest['msbuild-sdks']) {
        for (const depName of Object.keys(manifest['msbuild-sdks'])) {
            const currentValue = manifest['msbuild-sdks'][depName];
            const dep = {
                depType: 'msbuild-sdk',
                depName,
                currentValue,
                datasource: nuget_1.NugetDatasource.id,
            };
            deps.push(dep);
        }
    }
    return { deps };
}
exports.extractMsbuildGlobalManifest = extractMsbuildGlobalManifest;
//# sourceMappingURL=global-manifest.js.map