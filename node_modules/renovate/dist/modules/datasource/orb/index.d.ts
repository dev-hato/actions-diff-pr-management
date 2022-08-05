import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class OrbDatasource extends Datasource {
    static readonly id = "orb";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
