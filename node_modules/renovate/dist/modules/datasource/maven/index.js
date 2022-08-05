"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MavenDatasource = exports.defaultRegistryUrls = void 0;
const tslib_1 = require("tslib");
const is_1 = tslib_1.__importDefault(require("@sindresorhus/is"));
const luxon_1 = require("luxon");
const p_all_1 = tslib_1.__importDefault(require("p-all"));
const logger_1 = require("../../../logger");
const packageCache = tslib_1.__importStar(require("../../../util/cache/package"));
const regex_1 = require("../../../util/regex");
const url_1 = require("../../../util/url");
const maven_1 = tslib_1.__importDefault(require("../../versioning/maven"));
const mavenVersioning = tslib_1.__importStar(require("../../versioning/maven"));
const compare_1 = require("../../versioning/maven/compare");
const datasource_1 = require("../datasource");
const common_1 = require("./common");
const util_1 = require("./util");
function getLatestSuitableVersion(releases) {
    // istanbul ignore if
    if (!releases?.length) {
        return null;
    }
    const allVersions = releases.map(({ version }) => version);
    const stableVersions = allVersions.filter((x) => maven_1.default.isStable(x));
    const versions = stableVersions.length ? stableVersions : allVersions;
    return versions.reduce((latestVersion, version) => (0, compare_1.compare)(version, latestVersion) === 1 ? version : latestVersion);
}
function extractVersions(metadata) {
    const versions = metadata.descendantWithPath('versioning.versions');
    const elements = versions?.childrenNamed('version');
    if (!elements) {
        return [];
    }
    return elements.map((el) => el.val);
}
const mavenCentralHtmlVersionRegex = (0, regex_1.regEx)('^<a href="(?<version>[^"]+)\\/" title="(?:[^"]+)\\/">(?:[^"]+)\\/<\\/a>\\s+(?<releaseTimestamp>\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d)\\s+-$', 'i');
exports.defaultRegistryUrls = [common_1.MAVEN_REPO];
class MavenDatasource extends datasource_1.Datasource {
    constructor(id = MavenDatasource.id) {
        super(id);
        this.defaultRegistryUrls = exports.defaultRegistryUrls;
        this.defaultVersioning = mavenVersioning.id;
        this.registryStrategy = 'merge';
    }
    async fetchReleasesFromMetadata(dependency, repoUrl) {
        const metadataUrl = (0, util_1.getMavenUrl)(dependency, repoUrl, 'maven-metadata.xml');
        const cacheNamespace = 'datasource-maven:metadata-xml';
        const cacheKey = metadataUrl.toString();
        const cachedVersions = await packageCache.get(cacheNamespace, cacheKey);
        /* istanbul ignore if */
        if (cachedVersions) {
            return cachedVersions;
        }
        const { isCacheable, xml: mavenMetadata } = await (0, util_1.downloadMavenXml)(this.http, metadataUrl);
        if (!mavenMetadata) {
            return {};
        }
        const versions = extractVersions(mavenMetadata);
        const releaseMap = versions.reduce((acc, version) => ({ ...acc, [version]: null }), {});
        if (isCacheable) {
            await packageCache.set(cacheNamespace, cacheKey, releaseMap, 30);
        }
        return releaseMap;
    }
    async addReleasesFromIndexPage(inputReleaseMap, dependency, repoUrl) {
        const cacheNs = 'datasource-maven:index-html-releases';
        const cacheKey = `${repoUrl}${dependency.dependencyUrl}`;
        let workingReleaseMap = await packageCache.get(cacheNs, cacheKey);
        if (!workingReleaseMap) {
            workingReleaseMap = {};
            let retryEarlier = false;
            try {
                if (repoUrl.startsWith(common_1.MAVEN_REPO)) {
                    const indexUrl = (0, util_1.getMavenUrl)(dependency, repoUrl, 'index.html');
                    const res = await (0, util_1.downloadHttpProtocol)(this.http, indexUrl);
                    const { body = '' } = res;
                    for (const line of body.split(regex_1.newlineRegex)) {
                        const match = line.trim().match(mavenCentralHtmlVersionRegex);
                        if (match) {
                            const { version, releaseTimestamp: timestamp } = match?.groups ?? {};
                            if (version && timestamp) {
                                const date = luxon_1.DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm', {
                                    zone: 'UTC',
                                });
                                if (date.isValid) {
                                    const releaseTimestamp = date.toISO();
                                    workingReleaseMap[version] = { version, releaseTimestamp };
                                }
                            }
                        }
                    }
                }
            }
            catch (err) /* istanbul ignore next */ {
                retryEarlier = true;
                logger_1.logger.debug({ dependency, err }, 'Failed to get releases from index.html');
            }
            const cacheTTL = retryEarlier ? 60 : 24 * 60;
            await packageCache.set(cacheNs, cacheKey, workingReleaseMap, cacheTTL);
        }
        const releaseMap = { ...inputReleaseMap };
        for (const version of Object.keys(releaseMap)) {
            releaseMap[version] || (releaseMap[version] = workingReleaseMap[version] ?? null);
        }
        return releaseMap;
    }
    /**
     *
     * Double-check releases using HEAD request and
     * attach timestamps obtained from `Last-Modified` header.
     *
     * Example input:
     *
     * {
     *   '1.0.0': {
     *     version: '1.0.0',
     *     releaseTimestamp: '2020-01-01T01:00:00.000Z',
     *   },
     *   '1.0.1': null,
     * }
     *
     * Example output:
     *
     * {
     *   '1.0.0': {
     *     version: '1.0.0',
     *     releaseTimestamp: '2020-01-01T01:00:00.000Z',
     *   },
     *   '1.0.1': {
     *     version: '1.0.1',
     *     releaseTimestamp: '2021-01-01T01:00:00.000Z',
     *   }
     * }
     *
     * It should validate `1.0.0` with HEAD request, but leave `1.0.1` intact.
     *
     */
    async addReleasesUsingHeadRequests(inputReleaseMap, dependency, repoUrl) {
        const releaseMap = { ...inputReleaseMap };
        if (process.env.RENOVATE_EXPERIMENTAL_NO_MAVEN_POM_CHECK) {
            return releaseMap;
        }
        const cacheNs = 'datasource-maven:head-requests';
        const cacheTimeoutNs = 'datasource-maven:head-requests-timeout';
        const cacheKey = `${repoUrl}${dependency.dependencyUrl}`;
        // Store cache validity as the separate flag.
        // This allows both cache updating and resetting.
        //
        // Even if new version is being released each 10 minutes,
        // we still want to reset the whole cache after 24 hours.
        const isCacheValid = await packageCache.get(cacheTimeoutNs, cacheKey);
        let cachedReleaseMap = {};
        // istanbul ignore if
        if (isCacheValid) {
            const cache = await packageCache.get(cacheNs, cacheKey);
            if (cache) {
                cachedReleaseMap = cache;
            }
        }
        // List versions to check with HEAD request
        const freshVersions = Object.entries(releaseMap)
            .filter(([version, release]) => {
            // Release is present in maven-metadata.xml,
            // but haven't been validated yet
            const isValidatedAtPreviousSteps = release !== null;
            // Release was validated and cached with HEAD request during previous run
            const isValidatedHere = !is_1.default.undefined(cachedReleaseMap[version]);
            // Select only valid releases not yet verified with HEAD request
            return !isValidatedAtPreviousSteps && !isValidatedHere;
        })
            .map(([k]) => k);
        // Update cached data with freshly discovered versions
        if (freshVersions.length) {
            const queue = freshVersions.map((version) => async () => {
                const pomUrl = await (0, util_1.createUrlForDependencyPom)(this.http, version, dependency, repoUrl);
                const artifactUrl = (0, util_1.getMavenUrl)(dependency, repoUrl, pomUrl);
                const release = { version };
                const res = await (0, util_1.checkResource)(this.http, artifactUrl);
                if (is_1.default.date(res)) {
                    release.releaseTimestamp = res.toISOString();
                }
                cachedReleaseMap[version] =
                    res !== 'not-found' && res !== 'error' ? release : null;
            });
            await (0, p_all_1.default)(queue, { concurrency: 5 });
            if (!isCacheValid) {
                // Store new TTL flag for 24 hours if the previous one is invalidated
                await packageCache.set(cacheTimeoutNs, cacheKey, 'long', 24 * 60);
            }
            // Store updated cache object
            await packageCache.set(cacheNs, cacheKey, cachedReleaseMap, 24 * 60);
        }
        // Filter releases with the versions validated via HEAD request
        for (const version of Object.keys(releaseMap)) {
            releaseMap[version] = cachedReleaseMap[version] ?? null;
        }
        return releaseMap;
    }
    getReleasesFromMap(releaseMap) {
        const releases = Object.values(releaseMap).filter(is_1.default.truthy);
        if (releases.length) {
            return releases;
        }
        return Object.keys(releaseMap).map((version) => ({ version }));
    }
    async getReleases({ packageName, registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        const dependency = (0, util_1.getDependencyParts)(packageName);
        const repoUrl = (0, url_1.ensureTrailingSlash)(registryUrl);
        logger_1.logger.debug(`Looking up ${dependency.display} in repository ${repoUrl}`);
        let releaseMap = await this.fetchReleasesFromMetadata(dependency, repoUrl);
        releaseMap = await this.addReleasesFromIndexPage(releaseMap, dependency, repoUrl);
        releaseMap = await this.addReleasesUsingHeadRequests(releaseMap, dependency, repoUrl);
        const releases = this.getReleasesFromMap(releaseMap);
        if (!releases?.length) {
            return null;
        }
        logger_1.logger.debug(`Found ${releases.length} new releases for ${dependency.display} in repository ${repoUrl}`);
        const latestSuitableVersion = getLatestSuitableVersion(releases);
        const dependencyInfo = latestSuitableVersion &&
            (await (0, util_1.getDependencyInfo)(this.http, dependency, repoUrl, latestSuitableVersion));
        return { ...dependency, ...dependencyInfo, releases };
    }
}
exports.MavenDatasource = MavenDatasource;
MavenDatasource.id = 'maven';
//# sourceMappingURL=index.js.map