"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalRubyGemsDatasource = void 0;
const tslib_1 = require("tslib");
const marshal_1 = tslib_1.__importDefault(require("marshal"));
const logger_1 = require("../../../logger");
const http_1 = require("../../../util/http");
const url_1 = require("../../../util/url");
const datasource_1 = require("../datasource");
const INFO_PATH = '/api/v1/gems';
const VERSIONS_PATH = '/api/v1/versions';
const DEPENDENCIES_PATH = '/api/v1/dependencies';
class InternalRubyGemsDatasource extends datasource_1.Datasource {
    constructor(id) {
        super(id);
        this.id = id;
        this.knownFallbackHosts = ['rubygems.pkg.github.com', 'gitlab.com'];
    }
    getReleases({ packageName, registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return Promise.resolve(null);
        }
        const hostname = (0, url_1.parseUrl)(registryUrl)?.hostname;
        if (hostname && this.knownFallbackHosts.includes(hostname)) {
            return this.getDependencyFallback(packageName, registryUrl);
        }
        return this.getDependency(packageName, registryUrl);
    }
    async getDependencyFallback(dependency, registry) {
        logger_1.logger.debug({ dependency, api: DEPENDENCIES_PATH }, 'RubyGems lookup for dependency');
        const info = await this.fetchBuffer(dependency, registry, DEPENDENCIES_PATH);
        if (!info || info.length === 0) {
            return null;
        }
        const releases = info.map(({ number: version, platform: rubyPlatform }) => ({
            version,
            rubyPlatform,
        }));
        return {
            releases,
            sourceUrl: null,
        };
    }
    async getDependency(dependency, registry) {
        logger_1.logger.debug({ dependency, api: INFO_PATH }, 'RubyGems lookup for dependency');
        let info;
        try {
            info = await this.fetchJson(dependency, registry, INFO_PATH);
        }
        catch (error) {
            // fallback to deps api on 404
            if (error instanceof http_1.HttpError && error.response?.statusCode === 404) {
                return await this.getDependencyFallback(dependency, registry);
            }
            throw error;
        }
        if (!info) {
            logger_1.logger.debug({ dependency }, 'RubyGems package not found.');
            return null;
        }
        if (dependency.toLowerCase() !== info.name.toLowerCase()) {
            logger_1.logger.warn({ lookup: dependency, returned: info.name }, 'Lookup name does not match with returned.');
            return null;
        }
        let versions = [];
        let releases = [];
        try {
            versions = await this.fetchJson(dependency, registry, VERSIONS_PATH);
        }
        catch (err) {
            if (err.statusCode === 400 || err.statusCode === 404) {
                logger_1.logger.debug({ registry }, 'versions endpoint returns error - falling back to info endpoint');
            }
            else {
                throw err;
            }
        }
        // TODO: invalid properties for `Release` see #11312
        if (versions.length === 0 && info.version) {
            logger_1.logger.warn('falling back to the version from the info endpoint');
            releases = [
                {
                    version: info.version,
                    rubyPlatform: info.platform,
                },
            ];
        }
        else {
            releases = versions.map(({ number: version, platform: rubyPlatform, created_at: releaseTimestamp, rubygems_version: rubygemsVersion, ruby_version: rubyVersion, }) => ({
                version,
                rubyPlatform,
                releaseTimestamp,
                rubygemsVersion,
                rubyVersion,
            }));
        }
        return {
            releases,
            homepage: info.homepage_uri,
            sourceUrl: info.source_code_uri,
            changelogUrl: info.changelog_uri,
        };
    }
    async fetchJson(dependency, registry, path) {
        const url = (0, url_1.joinUrlParts)(registry, path, `${dependency}.json`);
        logger_1.logger.trace({ registry, dependency, url }, `RubyGems lookup request`);
        const response = (await this.http.getJson(url)) || {
            body: undefined,
        };
        return response.body;
    }
    async fetchBuffer(dependency, registry, path) {
        const url = `${(0, url_1.joinUrlParts)(registry, path)}?${(0, url_1.getQueryString)({
            gems: dependency,
        })}`;
        logger_1.logger.trace({ registry, dependency, url }, `RubyGems lookup request`);
        const response = await this.http.getBuffer(url);
        // istanbul ignore if: needs tests
        if (!response) {
            return null;
        }
        return new marshal_1.default(response.body).parsed;
    }
}
exports.InternalRubyGemsDatasource = InternalRubyGemsDatasource;
//# sourceMappingURL=get.js.map