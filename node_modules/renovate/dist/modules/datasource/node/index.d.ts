import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class NodeDatasource extends Datasource {
    static readonly id = "node";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "node";
    readonly caching = true;
    getReleases({ registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
