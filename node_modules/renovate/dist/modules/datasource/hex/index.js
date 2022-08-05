"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexDatasource = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const decorator_1 = require("../../../util/cache/package/decorator");
const hexVersioning = tslib_1.__importStar(require("../../versioning/hex"));
const datasource_1 = require("../datasource");
class HexDatasource extends datasource_1.Datasource {
    constructor() {
        super(HexDatasource.id);
        this.defaultRegistryUrls = ['https://hex.pm/'];
        this.customRegistrySupport = false;
        this.defaultVersioning = hexVersioning.id;
    }
    async getReleases({ packageName, registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        // Get dependency name from packageName.
        // If the dependency is private packageName contains organization name as following:
        // hexPackageName:organizationName
        // hexPackageName is used to pass it in hex dep url
        // organizationName is used for accessing to private deps
        const [hexPackageName, organizationName] = packageName.split(':');
        const organizationUrlPrefix = organizationName
            ? `repos/${organizationName}/`
            : '';
        const hexUrl = `${registryUrl}api/${organizationUrlPrefix}packages/${hexPackageName}`;
        let response;
        try {
            response = await this.http.getJson(hexUrl);
        }
        catch (err) {
            this.handleGenericErrors(err);
        }
        const hexRelease = response.body;
        if (!hexRelease) {
            logger_1.logger.warn({ datasource: 'hex', packageName }, `Invalid response body`);
            return null;
        }
        const { releases = [], html_url: homepage, meta } = hexRelease;
        if (releases.length === 0) {
            logger_1.logger.debug(`No versions found for ${hexPackageName} (${hexUrl})`); // prettier-ignore
            return null;
        }
        const result = {
            releases: releases.map(({ version, inserted_at }) => inserted_at
                ? {
                    version,
                    releaseTimestamp: inserted_at,
                }
                : { version }),
        };
        if (homepage) {
            result.homepage = homepage;
        }
        if (meta?.links?.Github) {
            result.sourceUrl = meta?.links?.Github;
        }
        return result;
    }
}
HexDatasource.id = 'hex';
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: `datasource-${HexDatasource.id}`,
        key: ({ packageName }) => packageName,
    })
], HexDatasource.prototype, "getReleases", null);
exports.HexDatasource = HexDatasource;
//# sourceMappingURL=index.js.map