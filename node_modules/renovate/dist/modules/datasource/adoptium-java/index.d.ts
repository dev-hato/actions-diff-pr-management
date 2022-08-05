import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class AdoptiumJavaDatasource extends Datasource {
    static readonly id = "adoptium-java";
    constructor();
    readonly customRegistrySupport = false;
    readonly defaultRegistryUrls: string[];
    readonly caching = true;
    private getPageReleases;
    getReleases({ registryUrl, packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
