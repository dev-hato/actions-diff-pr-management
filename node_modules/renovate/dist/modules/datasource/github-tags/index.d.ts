import { GithubReleasesDatasource } from '../github-releases';
import type { DigestConfig, GetReleasesConfig, ReleaseResult } from '../types';
export declare class GithubTagsDatasource extends GithubReleasesDatasource {
    static readonly id = "github-tags";
    private tagsCache;
    constructor();
    getTagCommit(registryUrl: string | undefined, packageName: string, tag: string): Promise<string | null>;
    getCommit(registryUrl: string | undefined, githubRepo: string): Promise<string | null>;
    /**
     * github.getDigest
     *
     * The `newValue` supplied here should be a valid tag for the docker image.
     *
     * Returns the latest commit hash for the repository.
     */
    getDigest({ packageName: repo, registryUrl }: Partial<DigestConfig>, newValue?: string): Promise<string | null>;
    getReleases(config: GetReleasesConfig): Promise<ReleaseResult>;
}
