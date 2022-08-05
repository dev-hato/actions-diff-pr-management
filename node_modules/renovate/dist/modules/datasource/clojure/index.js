"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClojureDatasource = void 0;
const maven_1 = require("../maven");
const common_1 = require("../maven/common");
const common_2 = require("./common");
class ClojureDatasource extends maven_1.MavenDatasource {
    constructor() {
        super(ClojureDatasource.id);
        this.registryStrategy = 'merge';
        this.defaultRegistryUrls = [common_2.CLOJARS_REPO, common_1.MAVEN_REPO];
    }
}
exports.ClojureDatasource = ClojureDatasource;
ClojureDatasource.id = 'clojure';
//# sourceMappingURL=index.js.map