"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageFile = void 0;
const toml_1 = require("@iarna/toml");
const logger_1 = require("../../../logger");
const fs_1 = require("../../../util/fs");
const crate_1 = require("../../datasource/crate");
function extractFromSection(parsedContent, section, cargoRegistries, target) {
    const deps = [];
    const sectionContent = parsedContent[section];
    if (!sectionContent) {
        return [];
    }
    Object.keys(sectionContent).forEach((depName) => {
        let skipReason;
        let currentValue = sectionContent[depName];
        let nestedVersion = false;
        let registryUrls;
        let packageName;
        if (typeof currentValue !== 'string') {
            const version = currentValue.version;
            const path = currentValue.path;
            const git = currentValue.git;
            const registryName = currentValue.registry;
            packageName = currentValue.package;
            if (version) {
                currentValue = version;
                nestedVersion = true;
                if (registryName) {
                    const registryUrl = cargoRegistries[registryName];
                    if (registryUrl) {
                        registryUrls = [registryUrl];
                    }
                    else {
                        skipReason = 'unknown-registry';
                    }
                }
                if (path) {
                    skipReason = 'path-dependency';
                }
                if (git) {
                    skipReason = 'git-dependency';
                }
            }
            else if (path) {
                currentValue = '';
                skipReason = 'path-dependency';
            }
            else if (git) {
                currentValue = '';
                skipReason = 'git-dependency';
            }
            else {
                currentValue = '';
                skipReason = 'invalid-dependency-specification';
            }
        }
        const dep = {
            depName,
            depType: section,
            currentValue: currentValue,
            managerData: { nestedVersion },
            datasource: crate_1.CrateDatasource.id,
        };
        if (registryUrls) {
            dep.registryUrls = registryUrls;
        }
        if (skipReason) {
            dep.skipReason = skipReason;
        }
        if (target) {
            dep.target = target;
        }
        if (packageName) {
            dep.packageName = packageName;
        }
        deps.push(dep);
    });
    return deps;
}
/** Reads `.cargo/config.toml`, or, if not found, `.cargo/config` */
async function readCargoConfig() {
    for (const configName of ['config.toml', 'config']) {
        const path = `.cargo/${configName}`;
        const payload = await (0, fs_1.readLocalFile)(path, 'utf8');
        if (payload) {
            try {
                return (0, toml_1.parse)(payload);
            }
            catch (err) {
                logger_1.logger.debug({ err }, `Error parsing ${path}`);
            }
            break;
        }
    }
    logger_1.logger.debug('Neither .cargo/config nor .cargo/config.toml found');
    return null;
}
/** Extracts a map of cargo registries from a CargoConfig */
function extractCargoRegistries(config) {
    const result = {};
    if (!config?.registries) {
        return result;
    }
    const { registries } = config;
    for (const registryName of Object.keys(registries)) {
        const registry = registries[registryName];
        if (registry.index) {
            result[registryName] = registry.index;
        }
        else {
            logger_1.logger.debug({ registryName }, 'cargo registry is missing index');
        }
    }
    return result;
}
async function extractPackageFile(content, fileName, _config) {
    logger_1.logger.trace(`cargo.extractPackageFile(${fileName})`);
    const cargoConfig = await readCargoConfig();
    const cargoRegistries = extractCargoRegistries(cargoConfig);
    let cargoManifest;
    try {
        cargoManifest = (0, toml_1.parse)(content);
    }
    catch (err) {
        logger_1.logger.debug({ err }, 'Error parsing Cargo.toml file');
        return null;
    }
    /*
      There are the following sections in Cargo.toml:
      [dependencies]
      [dev-dependencies]
      [build-dependencies]
      [target.*.dependencies]
    */
    const targetSection = cargoManifest.target;
    // An array of all dependencies in the target section
    let targetDeps = [];
    if (targetSection) {
        const targets = Object.keys(targetSection);
        targets.forEach((target) => {
            const targetContent = targetSection[target];
            // Dependencies for `${target}`
            const deps = [
                ...extractFromSection(targetContent, 'dependencies', cargoRegistries, target),
                ...extractFromSection(targetContent, 'dev-dependencies', cargoRegistries, target),
                ...extractFromSection(targetContent, 'build-dependencies', cargoRegistries, target),
            ];
            targetDeps = targetDeps.concat(deps);
        });
    }
    const deps = [
        ...extractFromSection(cargoManifest, 'dependencies', cargoRegistries),
        ...extractFromSection(cargoManifest, 'dev-dependencies', cargoRegistries),
        ...extractFromSection(cargoManifest, 'build-dependencies', cargoRegistries),
        ...targetDeps,
    ];
    if (!deps.length) {
        return null;
    }
    const lockFileName = await (0, fs_1.findLocalSiblingOrParent)(fileName, 'Cargo.lock');
    const res = { deps };
    // istanbul ignore if
    if (lockFileName) {
        res.lockFiles = [lockFileName];
    }
    return res;
}
exports.extractPackageFile = extractPackageFile;
//# sourceMappingURL=extract.js.map