import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class GalaxyDatasource extends Datasource {
    static readonly id = "galaxy";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
