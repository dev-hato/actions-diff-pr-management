"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitBucketTagsDatasource = void 0;
const tslib_1 = require("tslib");
const decorator_1 = require("../../../util/cache/package/decorator");
const bitbucket_1 = require("../../../util/http/bitbucket");
const url_1 = require("../../../util/url");
const utils = tslib_1.__importStar(require("../../platform/bitbucket/utils"));
const datasource_1 = require("../datasource");
class BitBucketTagsDatasource extends datasource_1.Datasource {
    constructor() {
        super(BitBucketTagsDatasource.id);
        this.bitbucketHttp = new bitbucket_1.BitbucketHttp(BitBucketTagsDatasource.id);
    }
    static getRegistryURL(registryUrl) {
        // fallback to default API endpoint if custom not provided
        return registryUrl ?? this.defaultRegistryUrls[0];
    }
    static getCacheKey(registryUrl, repo, type) {
        return `${BitBucketTagsDatasource.getRegistryURL(registryUrl)}:${repo}:${type}`;
    }
    static getSourceUrl(packageName, registryUrl) {
        const url = BitBucketTagsDatasource.getRegistryURL(registryUrl);
        const normalizedUrl = (0, url_1.ensureTrailingSlash)(url);
        return `${normalizedUrl}${packageName}`;
    }
    // getReleases fetches list of tags for the repository
    async getReleases({ registryUrl, packageName: repo, }) {
        const url = `/2.0/repositories/${repo}/refs/tags`;
        const bitbucketTags = await utils.accumulateValues(url);
        const dependency = {
            sourceUrl: BitBucketTagsDatasource.getSourceUrl(repo, registryUrl),
            registryUrl: BitBucketTagsDatasource.getRegistryURL(registryUrl),
            releases: bitbucketTags.map(({ name, target }) => ({
                version: name,
                gitRef: name,
                releaseTimestamp: target?.date,
            })),
        };
        return dependency;
    }
    // getTagCommit fetched the commit has for specified tag
    async getTagCommit(_registryUrl, repo, tag) {
        const url = `/2.0/repositories/${repo}/refs/tags/${tag}`;
        const bitbucketTag = (await this.bitbucketHttp.getJson(url))
            .body;
        return bitbucketTag.target?.hash ?? null;
    }
    async getMainBranch(repo) {
        return (await this.bitbucketHttp.getJson(`/2.0/repositories/${repo}`)).body.mainbranch.name;
    }
    // getDigest fetched the latest commit for repository main branch
    // however, if newValue is provided, then getTagCommit is called
    async getDigest({ packageName: repo, registryUrl }, newValue) {
        if (newValue?.length) {
            return this.getTagCommit(registryUrl, repo, newValue);
        }
        const mainBranch = await this.getMainBranch(repo);
        const url = `/2.0/repositories/${repo}/commits/${mainBranch}`;
        const bitbucketCommits = (await this.bitbucketHttp.getJson(url)).body;
        if (bitbucketCommits.values.length === 0) {
            return null;
        }
        return bitbucketCommits.values[0].hash;
    }
}
BitBucketTagsDatasource.id = 'bitbucket-tags';
BitBucketTagsDatasource.customRegistrySupport = true;
BitBucketTagsDatasource.registryStrategy = 'first';
BitBucketTagsDatasource.defaultRegistryUrls = ['https://bitbucket.org'];
BitBucketTagsDatasource.cacheNamespace = `datasource-${BitBucketTagsDatasource.id}`;
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: BitBucketTagsDatasource.cacheNamespace,
        key: ({ registryUrl, packageName }) => BitBucketTagsDatasource.getCacheKey(registryUrl, packageName, 'tags'),
    })
], BitBucketTagsDatasource.prototype, "getReleases", null);
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: BitBucketTagsDatasource.cacheNamespace,
        key: (registryUrl, repo, tag) => BitBucketTagsDatasource.getCacheKey(registryUrl, repo, `tag-${tag}`),
    })
], BitBucketTagsDatasource.prototype, "getTagCommit", null);
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: BitBucketTagsDatasource.cacheNamespace,
        key: (registryUrl, repo) => BitBucketTagsDatasource.getCacheKey(registryUrl, repo, 'mainbranch'),
        ttlMinutes: 60,
    })
], BitBucketTagsDatasource.prototype, "getMainBranch", null);
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: BitBucketTagsDatasource.cacheNamespace,
        key: ({ registryUrl, packageName }) => BitBucketTagsDatasource.getCacheKey(registryUrl, packageName, 'digest'),
    })
], BitBucketTagsDatasource.prototype, "getDigest", null);
exports.BitBucketTagsDatasource = BitBucketTagsDatasource;
//# sourceMappingURL=index.js.map