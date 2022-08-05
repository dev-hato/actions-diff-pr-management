import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class DartDatasource extends Datasource {
    static readonly id = "dart";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
