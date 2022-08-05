"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDockerCommand = exports.removeDanglingContainers = exports.removeDockerContainer = exports.getDockerTag = exports.resetPrefetchedImages = exports.prefetchDockerImage = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const global_1 = require("../../../config/global");
const error_messages_1 = require("../../../constants/error-messages");
const logger_1 = require("../../../logger");
const datasource_1 = require("../../../modules/datasource");
const versioning = tslib_1.__importStar(require("../../../modules/versioning"));
const regex_1 = require("../../regex");
const url_1 = require("../../url");
const common_1 = require("../common");
const prefetchedImages = new Map();
const digestRegex = (0, regex_1.regEx)('Digest: (.*?)\n');
async function prefetchDockerImage(taggedImage) {
    if (prefetchedImages.has(taggedImage)) {
        logger_1.logger.debug(`Docker image is already prefetched: ${taggedImage}@${prefetchedImages.get(taggedImage)}`);
    }
    else {
        logger_1.logger.debug(`Fetching Docker image: ${taggedImage}`);
        const res = await (0, common_1.rawExec)(`docker pull ${taggedImage}`, {
            encoding: 'utf-8',
        });
        const imageDigest = digestRegex.exec(res?.stdout)?.[1] ?? 'unknown';
        logger_1.logger.debug(`Finished fetching Docker image ${taggedImage}@${imageDigest}`);
        prefetchedImages.set(taggedImage, imageDigest);
    }
}
exports.prefetchDockerImage = prefetchDockerImage;
function resetPrefetchedImages() {
    prefetchedImages.clear();
}
exports.resetPrefetchedImages = resetPrefetchedImages;
function expandVolumeOption(x) {
    if (is_1.default.nonEmptyString(x)) {
        return [x, x];
    }
    if (Array.isArray(x) && x.length === 2) {
        const [from, to] = x;
        if (is_1.default.nonEmptyString(from) && is_1.default.nonEmptyString(to)) {
            return [from, to];
        }
    }
    return null;
}
function volumesEql(x, y) {
    const [xFrom, xTo] = x;
    const [yFrom, yTo] = y;
    return xFrom === yFrom && xTo === yTo;
}
function uniq(array, eql = (x, y) => x === y) {
    return array.filter((x, idx, arr) => arr.findIndex((y) => eql(x, y)) === idx);
}
function prepareVolumes(volumes = []) {
    const expanded = volumes.map(expandVolumeOption);
    const filtered = expanded.filter((vol) => vol !== null);
    const unique = uniq(filtered, volumesEql);
    return unique.map(([from, to]) => `-v "${from}":"${to}"`);
}
function prepareCommands(commands) {
    return commands.filter((command) => is_1.default.string(command));
}
async function getDockerTag(depName, constraint, scheme) {
    const ver = versioning.get(scheme);
    if (!ver.isValid(constraint)) {
        logger_1.logger.warn({ scheme, constraint }, `Invalid Docker image version constraint`);
        return 'latest';
    }
    logger_1.logger.debug({ depName, scheme, constraint }, `Found version constraint - checking for a compatible image to use`);
    const imageReleases = await (0, datasource_1.getPkgReleases)({
        datasource: 'docker',
        depName,
        versioning: scheme,
    });
    if (imageReleases?.releases) {
        let versions = imageReleases.releases.map((release) => release.version);
        versions = versions.filter((version) => ver.isVersion(version) && ver.matches(version, constraint));
        // Prefer stable versions over unstable, even if the range satisfies both types
        if (!versions.every((version) => ver.isStable(version))) {
            logger_1.logger.debug('Filtering out unstable versions');
            versions = versions.filter((version) => ver.isStable(version));
        }
        const version = versions.sort(ver.sortVersions.bind(ver)).pop();
        if (version) {
            logger_1.logger.debug({ depName, scheme, constraint, version }, `Found compatible image version`);
            return version;
        }
    }
    else {
        logger_1.logger.error(`No ${depName} releases found`);
        return 'latest';
    }
    logger_1.logger.warn({ depName, constraint, scheme }, 'Failed to find a tag satisfying constraint, using "latest" tag instead');
    return 'latest';
}
exports.getDockerTag = getDockerTag;
function getContainerName(image, prefix) {
    return `${prefix ?? 'renovate_'}${image}`.replace((0, regex_1.regEx)(/\//g), '_');
}
function getContainerLabel(prefix) {
    return `${prefix ?? 'renovate_'}child`;
}
async function removeDockerContainer(image, prefix) {
    const containerName = getContainerName(image, prefix);
    let cmd = `docker ps --filter name=${containerName} -aq`;
    try {
        const res = await (0, common_1.rawExec)(cmd, {
            encoding: 'utf-8',
        });
        const containerId = res?.stdout?.trim() || '';
        if (containerId.length) {
            logger_1.logger.debug({ containerId }, 'Removing container');
            cmd = `docker rm -f ${containerId}`;
            await (0, common_1.rawExec)(cmd, {
                encoding: 'utf-8',
            });
        }
        else {
            logger_1.logger.trace({ image, containerName }, 'No running containers to remove');
        }
    }
    catch (err) {
        logger_1.logger.warn({ image, containerName, cmd, err }, 'Could not remove Docker container');
    }
}
exports.removeDockerContainer = removeDockerContainer;
async function removeDanglingContainers() {
    const { binarySource, dockerChildPrefix } = global_1.GlobalConfig.get();
    if (binarySource !== 'docker') {
        return;
    }
    try {
        const containerLabel = getContainerLabel(dockerChildPrefix);
        const res = await (0, common_1.rawExec)(`docker ps --filter label=${containerLabel} -aq`, {
            encoding: 'utf-8',
        });
        if (res?.stdout?.trim().length) {
            const containerIds = res.stdout
                .trim()
                .split(regex_1.newlineRegex)
                .map((container) => container.trim())
                .filter(Boolean);
            logger_1.logger.debug({ containerIds }, 'Removing dangling child containers');
            await (0, common_1.rawExec)(`docker rm -f ${containerIds.join(' ')}`, {
                encoding: 'utf-8',
            });
        }
        else {
            logger_1.logger.debug('No dangling containers to remove');
        }
    }
    catch (err) {
        if (err.errno === 'ENOMEM') {
            throw new Error(error_messages_1.SYSTEM_INSUFFICIENT_MEMORY);
        }
        if (err.stderr?.includes('Cannot connect to the Docker daemon')) {
            logger_1.logger.info('No docker daemon found');
        }
        else {
            logger_1.logger.warn({ err }, 'Error removing dangling containers');
        }
    }
}
exports.removeDanglingContainers = removeDanglingContainers;
async function generateDockerCommand(commands, preCommands, options) {
    const { envVars, cwd, tagScheme, tagConstraint } = options;
    let image = options.image;
    const volumes = options.volumes ?? [];
    const { localDir, cacheDir, dockerUser, dockerChildPrefix, dockerImagePrefix, } = global_1.GlobalConfig.get();
    const result = ['docker run --rm'];
    const containerName = getContainerName(image, dockerChildPrefix);
    const containerLabel = getContainerLabel(dockerChildPrefix);
    result.push(`--name=${containerName}`);
    result.push(`--label=${containerLabel}`);
    if (dockerUser) {
        result.push(`--user=${dockerUser}`);
    }
    result.push(...prepareVolumes([localDir, cacheDir, ...volumes]));
    if (envVars) {
        result.push(...uniq(envVars)
            .filter(is_1.default.string)
            .map((e) => `-e ${e}`));
    }
    if (cwd) {
        result.push(`-w "${cwd}"`);
    }
    image = `${(0, url_1.ensureTrailingSlash)(dockerImagePrefix ?? 'renovate')}${image}`;
    let tag = null;
    if (options.tag) {
        tag = options.tag;
    }
    else if (tagConstraint) {
        const tagVersioning = tagScheme ?? 'semver';
        tag = await getDockerTag(image, tagConstraint, tagVersioning);
        logger_1.logger.debug({ image, tagConstraint, tagVersioning, tag }, 'Resolved tag constraint');
    }
    else {
        logger_1.logger.debug({ image }, 'No tag or tagConstraint specified');
    }
    const taggedImage = tag ? `${image}:${tag}` : `${image}`;
    await prefetchDockerImage(taggedImage);
    result.push(taggedImage);
    const bashCommand = [...prepareCommands(preCommands), ...commands].join(' && ');
    result.push(`bash -l -c "${bashCommand.replace((0, regex_1.regEx)(/"/g), '\\"')}"`); // lgtm [js/incomplete-sanitization]
    return result.join(' ');
}
exports.generateDockerCommand = generateDockerCommand;
//# sourceMappingURL=index.js.map