import type { DigestConfig, GetReleasesConfig, ReleaseResult } from '../types';
import { GitDatasource } from './base';
export declare class GitRefsDatasource extends GitDatasource {
    static readonly id = "git-refs";
    constructor();
    readonly customRegistrySupport = false;
    getReleases({ packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    getDigest({ packageName }: DigestConfig, newValue?: string): Promise<string | null>;
}
