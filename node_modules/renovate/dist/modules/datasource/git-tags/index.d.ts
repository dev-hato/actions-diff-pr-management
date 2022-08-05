import { GitDatasource } from '../git-refs/base';
import type { DigestConfig, GetReleasesConfig, ReleaseResult } from '../types';
export declare class GitTagsDatasource extends GitDatasource {
    static readonly id = "git-tags";
    constructor();
    readonly customRegistrySupport = false;
    getReleases({ packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    getDigest({ packageName }: DigestConfig, newValue?: string): Promise<string | null>;
}
