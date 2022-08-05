import { BitbucketHttp } from '../../../util/http/bitbucket';
import { Datasource } from '../datasource';
import type { DigestConfig, GetReleasesConfig, ReleaseResult } from '../types';
export declare class BitBucketTagsDatasource extends Datasource {
    bitbucketHttp: BitbucketHttp;
    static readonly id = "bitbucket-tags";
    static readonly customRegistrySupport = true;
    static readonly registryStrategy = "first";
    static readonly defaultRegistryUrls: string[];
    static readonly cacheNamespace: string;
    constructor();
    static getRegistryURL(registryUrl?: string): string;
    static getCacheKey(registryUrl: string | undefined, repo: string, type: string): string;
    static getSourceUrl(packageName: string, registryUrl?: string): string;
    getReleases({ registryUrl, packageName: repo, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    getTagCommit(_registryUrl: string | undefined, repo: string, tag: string): Promise<string | null>;
    getMainBranch(repo: string): Promise<string>;
    getDigest({ packageName: repo, registryUrl }: DigestConfig, newValue?: string): Promise<string | null>;
}
