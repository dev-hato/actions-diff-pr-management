"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NugetDatasource = exports.defaultRegistryUrls = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const nugetVersioning = tslib_1.__importStar(require("../../versioning/nuget"));
const datasource_1 = require("../datasource");
const common_1 = require("./common");
const v2 = tslib_1.__importStar(require("./v2"));
const v3 = tslib_1.__importStar(require("./v3"));
// https://api.nuget.org/v3/index.json is a default official nuget feed
exports.defaultRegistryUrls = ['https://api.nuget.org/v3/index.json'];
class NugetDatasource extends datasource_1.Datasource {
    constructor() {
        super(NugetDatasource.id);
        this.defaultRegistryUrls = exports.defaultRegistryUrls;
        this.defaultVersioning = nugetVersioning.id;
        this.registryStrategy = 'merge';
    }
    async getReleases({ packageName, registryUrl, }) {
        logger_1.logger.trace(`nuget.getReleases(${packageName})`);
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        const { feedUrl, protocolVersion } = (0, common_1.parseRegistryUrl)(registryUrl);
        if (protocolVersion === 2) {
            return v2.getReleases(this.http, feedUrl, packageName);
        }
        if (protocolVersion === 3) {
            const queryUrl = await v3.getResourceUrl(this.http, feedUrl);
            if (queryUrl) {
                return v3.getReleases(this.http, feedUrl, queryUrl, packageName);
            }
        }
        return null;
    }
}
exports.NugetDatasource = NugetDatasource;
NugetDatasource.id = 'nuget';
//# sourceMappingURL=index.js.map