import { Datasource } from '../datasource';
import type { DigestConfig, GetReleasesConfig, ReleaseResult } from '../types';
import { GoDirectDatasource } from './releases-direct';
import { GoProxyDatasource } from './releases-goproxy';
export declare class GoDatasource extends Datasource {
    static readonly id = "go";
    constructor();
    readonly customRegistrySupport = false;
    readonly goproxy: GoProxyDatasource;
    readonly direct: GoDirectDatasource;
    getReleases(config: GetReleasesConfig): Promise<ReleaseResult | null>;
    /**
     * go.getDigest
     *
     * This datasource resolves a go module URL into its source repository
     *  and then fetches the digest it if it is on GitHub.
     *
     * This function will:
     *  - Determine the source URL for the module
     *  - Call the respective getDigest in github to retrieve the commit hash
     */
    getDigest({ packageName }: DigestConfig, value?: string | null): Promise<string | null>;
}
