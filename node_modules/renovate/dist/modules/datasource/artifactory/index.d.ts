import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class ArtifactoryDatasource extends Datasource {
    static readonly id = "artifactory";
    constructor();
    readonly customRegistrySupport = true;
    readonly caching = true;
    readonly registryStrategy = "merge";
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    private static parseReleaseTimestamp;
}
