import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class GradleVersionDatasource extends Datasource {
    static readonly id = "gradle-version";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "gradle";
    readonly registryStrategy = "merge";
    private static readonly buildTimeRegex;
    getReleases({ registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    private static formatBuildTime;
}
