import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class HexDatasource extends Datasource {
    static readonly id = "hex";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly customRegistrySupport = false;
    readonly defaultVersioning = "hex";
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
