import { GitlabHttp } from '../../../util/http/gitlab';
import { Datasource } from '../datasource';
import type { DigestConfig, GetReleasesConfig, ReleaseResult } from '../types';
export declare class GitlabTagsDatasource extends Datasource {
    static readonly id = "gitlab-tags";
    protected http: GitlabHttp;
    constructor();
    readonly defaultRegistryUrls: string[];
    getReleases({ registryUrl, packageName: repo, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    /**
     * gitlab.getDigest
     *
     * Returs the latest commit hash of the repository.
     */
    getDigest({ packageName: repo, registryUrl }: Partial<DigestConfig>, newValue?: string): Promise<string | null>;
}
