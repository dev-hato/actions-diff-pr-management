"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbtPluginDatasource = exports.defaultRegistryUrls = exports.SBT_PLUGINS_REPO = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const http_1 = require("../../../util/http");
const regex_1 = require("../../../util/regex");
const url_1 = require("../../../util/url");
const ivyVersioning = tslib_1.__importStar(require("../../versioning/ivy"));
const compare_1 = require("../../versioning/maven/compare");
const util_1 = require("../maven/util");
const sbt_package_1 = require("../sbt-package");
const util_2 = require("../sbt-package/util");
exports.SBT_PLUGINS_REPO = 'https://dl.bintray.com/sbt/sbt-plugin-releases';
exports.defaultRegistryUrls = [exports.SBT_PLUGINS_REPO];
class SbtPluginDatasource extends sbt_package_1.SbtPackageDatasource {
    constructor() {
        super(SbtPluginDatasource.id);
        this.defaultRegistryUrls = exports.defaultRegistryUrls;
        this.registryStrategy = 'hunt';
        this.defaultVersioning = ivyVersioning.id;
        this.http = new http_1.Http('sbt');
    }
    async resolvePluginReleases(rootUrl, artifact, scalaVersion) {
        const searchRoot = `${rootUrl}/${artifact}`;
        const parse = (content) => (0, util_2.parseIndexDir)(content, (x) => !(0, regex_1.regEx)(/^\.+$/).test(x));
        const { body: indexContent } = await (0, util_1.downloadHttpProtocol)(this.http, (0, url_1.ensureTrailingSlash)(searchRoot));
        if (indexContent) {
            const releases = [];
            const scalaVersionItems = parse(indexContent);
            const scalaVersions = scalaVersionItems.map((x) => x.replace((0, regex_1.regEx)(/^scala_/), ''));
            const searchVersions = scalaVersions.includes(scalaVersion)
                ? [scalaVersion]
                : scalaVersions;
            for (const searchVersion of searchVersions) {
                const searchSubRoot = `${searchRoot}/scala_${searchVersion}`;
                const { body: subRootContent } = await (0, util_1.downloadHttpProtocol)(this.http, (0, url_1.ensureTrailingSlash)(searchSubRoot));
                if (subRootContent) {
                    const sbtVersionItems = parse(subRootContent);
                    for (const sbtItem of sbtVersionItems) {
                        const releasesRoot = `${searchSubRoot}/${sbtItem}`;
                        const { body: releasesIndexContent } = await (0, util_1.downloadHttpProtocol)(this.http, (0, url_1.ensureTrailingSlash)(releasesRoot));
                        if (releasesIndexContent) {
                            const releasesParsed = parse(releasesIndexContent);
                            releasesParsed.forEach((x) => releases.push(x));
                        }
                    }
                }
            }
            if (releases.length) {
                return [...new Set(releases)].sort(compare_1.compare);
            }
        }
        return null;
    }
    async getReleases({ packageName, registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        const [groupId, artifactId] = packageName.split(':');
        const groupIdSplit = groupId.split('.');
        const artifactIdSplit = artifactId.split('_');
        const [artifact, scalaVersion] = artifactIdSplit;
        const repoRoot = (0, url_1.ensureTrailingSlash)(registryUrl);
        const searchRoots = [];
        // Optimize lookup order
        searchRoots.push(`${repoRoot}${groupIdSplit.join('.')}`);
        searchRoots.push(`${repoRoot}${groupIdSplit.join('/')}`);
        for (let idx = 0; idx < searchRoots.length; idx += 1) {
            const searchRoot = searchRoots[idx];
            let versions = await this.resolvePluginReleases(searchRoot, artifact, scalaVersion);
            let urls = {};
            if (!versions?.length) {
                const artifactSubdirs = await this.getArtifactSubdirs(searchRoot, artifact, scalaVersion);
                versions = await this.getPackageReleases(searchRoot, artifactSubdirs);
                const latestVersion = (0, util_2.getLatestVersion)(versions);
                urls = await this.getUrls(searchRoot, artifactSubdirs, latestVersion);
            }
            const dependencyUrl = `${searchRoot}/${artifact}`;
            if (versions) {
                return {
                    ...urls,
                    dependencyUrl,
                    releases: versions.map((v) => ({ version: v })),
                };
            }
        }
        logger_1.logger.debug(`No versions found for ${packageName} in ${searchRoots.length} repositories`);
        return null;
    }
}
exports.SbtPluginDatasource = SbtPluginDatasource;
SbtPluginDatasource.id = 'sbt-plugin';
//# sourceMappingURL=index.js.map