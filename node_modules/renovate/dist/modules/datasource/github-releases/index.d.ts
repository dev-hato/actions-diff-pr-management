import { GithubHttp } from '../../../util/http/github';
import { Datasource } from '../datasource';
import type { DigestConfig, GetReleasesConfig, ReleaseResult } from '../types';
import type { DigestAsset, GithubRelease, GithubReleaseAsset } from './types';
export declare const cacheNamespace = "datasource-github-releases";
export declare class GithubReleasesDatasource extends Datasource {
    static id: string;
    readonly defaultRegistryUrls: string[];
    http: GithubHttp;
    private releasesCache;
    constructor(id?: string);
    findDigestFile(release: GithubRelease, digest: string): Promise<DigestAsset | null>;
    downloadAndDigest(asset: GithubReleaseAsset, algorithm: string): Promise<string>;
    findAssetWithDigest(release: GithubRelease, digest: string): Promise<DigestAsset | null>;
    /** Identify the asset associated with a known digest. */
    findDigestAsset(release: GithubRelease, digest: string): Promise<DigestAsset | null>;
    /** Given a digest asset, find the equivalent digest in a different release. */
    mapDigestAssetToRelease(digestAsset: DigestAsset, release: GithubRelease): Promise<string | null>;
    getDigest({ packageName: repo, currentValue, currentDigest, registryUrl, }: DigestConfig, newValue: string): Promise<string | null>;
    /**
     * github.getReleases
     *
     * This function can be used to fetch releases with a customisable versioning (e.g. semver) and with releases.
     *
     * This function will:
     *  - Fetch all releases
     *  - Sanitize the versions if desired (e.g. strip out leading 'v')
     *  - Return a dependency object containing sourceUrl string and releases array
     */
    getReleases(config: GetReleasesConfig): Promise<ReleaseResult>;
}
