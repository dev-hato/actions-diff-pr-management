"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrbDatasource = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const decorator_1 = require("../../../util/cache/package/decorator");
const datasource_1 = require("../datasource");
const query = `
query($packageName: String!) {
  orb(name: $packageName) {
    name,
    homeUrl,
    versions {
      version,
      createdAt
    }
  }
}
`;
class OrbDatasource extends datasource_1.Datasource {
    constructor() {
        super(OrbDatasource.id);
        this.customRegistrySupport = false;
        this.defaultRegistryUrls = ['https://circleci.com/'];
    }
    async getReleases({ packageName, registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        const url = `${registryUrl}graphql-unstable`;
        const body = {
            query,
            variables: { packageName },
        };
        const res = (await this.http.postJson(url, {
            body,
        })).body.data.orb;
        if (!res) {
            logger_1.logger.debug({ packageName }, 'Failed to look up orb');
            return null;
        }
        // Simplify response before caching and returning
        const homepage = res.homeUrl?.length
            ? res.homeUrl
            : `https://circleci.com/developer/orbs/orb/${packageName}`;
        const releases = res.versions.map(({ version, createdAt }) => ({
            version,
            releaseTimestamp: createdAt ?? null,
        }));
        const dep = { homepage, releases };
        logger_1.logger.trace({ dep }, 'dep');
        return dep;
    }
}
OrbDatasource.id = 'orb';
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: `datasource-${OrbDatasource.id}`,
        key: ({ packageName }) => packageName,
    })
], OrbDatasource.prototype, "getReleases", null);
exports.OrbDatasource = OrbDatasource;
//# sourceMappingURL=index.js.map