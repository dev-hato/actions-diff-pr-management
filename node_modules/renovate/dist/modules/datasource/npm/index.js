"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmDatasource = exports.setNpmrc = exports.resetCache = exports.resetMemCache = void 0;
const tslib_1 = require("tslib");
const npmVersioning = tslib_1.__importStar(require("../../versioning/npm"));
const datasource_1 = require("../datasource");
const common_1 = require("./common");
const get_1 = require("./get");
var get_2 = require("./get");
Object.defineProperty(exports, "resetMemCache", { enumerable: true, get: function () { return get_2.resetMemCache; } });
Object.defineProperty(exports, "resetCache", { enumerable: true, get: function () { return get_2.resetCache; } });
var npmrc_1 = require("./npmrc");
Object.defineProperty(exports, "setNpmrc", { enumerable: true, get: function () { return npmrc_1.setNpmrc; } });
class NpmDatasource extends datasource_1.Datasource {
    constructor() {
        super(NpmDatasource.id);
        this.customRegistrySupport = true;
        this.registryStrategy = 'first';
        this.defaultVersioning = npmVersioning.id;
    }
    async getReleases({ packageName, registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        const res = await (0, get_1.getDependency)(this.http, registryUrl, packageName);
        if (res) {
            res.tags || (res.tags = res['dist-tags']);
            delete res['dist-tags'];
        }
        return res;
    }
}
exports.NpmDatasource = NpmDatasource;
NpmDatasource.id = common_1.id;
//# sourceMappingURL=index.js.map