"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartDatasource = void 0;
const datasource_1 = require("../datasource");
class DartDatasource extends datasource_1.Datasource {
    constructor() {
        super(DartDatasource.id);
        this.customRegistrySupport = false;
        this.defaultRegistryUrls = ['https://pub.dartlang.org/'];
    }
    async getReleases({ packageName, registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        let result = null;
        const pkgUrl = `${registryUrl}api/packages/${packageName}`;
        let raw = null;
        try {
            raw = await this.http.getJson(pkgUrl);
        }
        catch (err) {
            this.handleGenericErrors(err);
        }
        const body = raw?.body;
        if (body) {
            const { versions, latest } = body;
            const releases = versions
                ?.filter(({ retracted }) => !retracted)
                ?.map(({ version, published }) => ({
                version,
                releaseTimestamp: published,
            }));
            if (releases && latest) {
                result = { releases };
                const pubspec = latest.pubspec;
                if (pubspec) {
                    if (pubspec.homepage) {
                        result.homepage = pubspec.homepage;
                    }
                    if (pubspec.repository) {
                        result.sourceUrl = pubspec.repository;
                    }
                }
            }
        }
        return result;
    }
}
exports.DartDatasource = DartDatasource;
DartDatasource.id = 'dart';
//# sourceMappingURL=index.js.map