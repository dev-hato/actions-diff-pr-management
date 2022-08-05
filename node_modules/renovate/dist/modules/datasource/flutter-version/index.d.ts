import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare const stableVersionRegex: RegExp;
export declare class FlutterVersionDatasource extends Datasource {
    static readonly id = "flutter-version";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    readonly caching = true;
    getReleases({ registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
