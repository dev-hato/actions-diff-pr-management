import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class GalaxyCollectionDatasource extends Datasource {
    static readonly id = "galaxy-collection";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
