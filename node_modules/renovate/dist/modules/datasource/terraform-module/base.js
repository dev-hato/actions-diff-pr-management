"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformDatasource = void 0;
const tslib_1 = require("tslib");
const external_host_error_1 = require("../../../types/errors/external-host-error");
const decorator_1 = require("../../../util/cache/package/decorator");
const url_1 = require("../../../util/url");
const datasource_1 = require("../datasource");
// TODO: extract to a separate directory structure (#10532)
class TerraformDatasource extends datasource_1.Datasource {
    async getTerraformServiceDiscoveryResult(registryUrl) {
        const discoveryURL = TerraformDatasource.getDiscoveryUrl(registryUrl);
        const serviceDiscovery = (await this.http.getJson(discoveryURL)).body;
        return serviceDiscovery;
    }
    static getDiscoveryUrl(registryUrl) {
        return `${(0, url_1.ensureTrailingSlash)(registryUrl)}.well-known/terraform.json`;
    }
    handleSpecificErrors(err) {
        const failureCodes = ['EAI_AGAIN'];
        // istanbul ignore if
        if (failureCodes.includes(err.code)) {
            throw new external_host_error_1.ExternalHostError(err);
        }
        // istanbul ignore if
        if (err.response?.statusCode === 503) {
            throw new external_host_error_1.ExternalHostError(err);
        }
    }
}
TerraformDatasource.id = 'terraform';
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: `datasource-${TerraformDatasource.id}`,
        key: (registryUrl) => TerraformDatasource.getDiscoveryUrl(registryUrl),
        ttlMinutes: 1440,
    })
], TerraformDatasource.prototype, "getTerraformServiceDiscoveryResult", null);
exports.TerraformDatasource = TerraformDatasource;
//# sourceMappingURL=base.js.map