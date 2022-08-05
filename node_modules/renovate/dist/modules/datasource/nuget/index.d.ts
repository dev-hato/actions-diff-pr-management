import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare const defaultRegistryUrls: string[];
export declare class NugetDatasource extends Datasource {
    static readonly id = "nuget";
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "nuget";
    readonly registryStrategy = "merge";
    constructor();
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
