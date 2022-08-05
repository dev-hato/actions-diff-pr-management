import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class CondaDatasource extends Datasource {
    static readonly id = "conda";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    readonly caching = true;
    getReleases({ registryUrl, packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
