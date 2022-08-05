import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class GitlabReleasesDatasource extends Datasource {
    static readonly id = "gitlab-releases";
    readonly defaultRegistryUrls: string[];
    static readonly registryStrategy = "first";
    constructor();
    getReleases({ registryUrl, packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
