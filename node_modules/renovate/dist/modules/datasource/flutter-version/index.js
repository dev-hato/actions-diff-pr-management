"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlutterVersionDatasource = exports.stableVersionRegex = void 0;
const regex_1 = require("../../../util/regex");
const datasource_1 = require("../datasource");
exports.stableVersionRegex = (0, regex_1.regEx)(/^\d+\.\d+\.\d+$/);
class FlutterVersionDatasource extends datasource_1.Datasource {
    constructor() {
        super(FlutterVersionDatasource.id);
        this.customRegistrySupport = false;
        this.defaultRegistryUrls = ['https://storage.googleapis.com'];
        this.caching = true;
    }
    async getReleases({ registryUrl, }) {
        // istanbul ignore if
        if (!registryUrl) {
            return null;
        }
        const result = {
            homepage: 'https://flutter.dev',
            sourceUrl: 'https://github.com/flutter/flutter',
            registryUrl,
            releases: [],
        };
        try {
            const resp = (await this.http.getJson(`${registryUrl}/flutter_infra_release/releases/releases_linux.json`)).body;
            result.releases = resp.releases
                // The API response contains a stable version being released as a non-stable
                // release. And so we filter out these releases here.
                .filter(({ version, channel }) => {
                if (exports.stableVersionRegex.test(version)) {
                    return channel === 'stable';
                }
                return true;
            })
                .map(({ version, release_date, channel }) => ({
                version,
                releaseTimestamp: release_date,
                isStable: channel === 'stable',
            }));
        }
        catch (err) {
            this.handleGenericErrors(err);
        }
        return result.releases.length ? result : null;
    }
}
exports.FlutterVersionDatasource = FlutterVersionDatasource;
FlutterVersionDatasource.id = 'flutter-version';
//# sourceMappingURL=index.js.map