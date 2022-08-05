import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class GolangVersionDatasource extends Datasource {
    static readonly id = "golang-version";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly customRegistrySupport = false;
    readonly defaultVersioning = "semver";
    getReleases({ registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
