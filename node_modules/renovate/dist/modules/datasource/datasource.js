"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datasource = void 0;
const external_host_error_1 = require("../../types/errors/external-host-error");
const http_1 = require("../../util/http");
class Datasource {
    constructor(id) {
        this.id = id;
        this.customRegistrySupport = true;
        this.registryStrategy = 'first';
        this.http = new http_1.Http(id);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleSpecificErrors(err) { }
    handleGenericErrors(err) {
        // istanbul ignore if: not easy testable with nock
        if (err instanceof external_host_error_1.ExternalHostError) {
            throw err;
        }
        this.handleSpecificErrors(err);
        if (err.response?.statusCode !== undefined) {
            if (err.response?.statusCode === 429 ||
                (err.response?.statusCode >= 500 && err.response?.statusCode < 600)) {
                throw new external_host_error_1.ExternalHostError(err);
            }
        }
        throw err;
    }
}
exports.Datasource = Datasource;
//# sourceMappingURL=datasource.js.map