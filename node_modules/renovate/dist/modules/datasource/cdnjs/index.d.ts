import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class CdnJsDatasource extends Datasource {
    static readonly id = "cdnjs";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    readonly caching = true;
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
