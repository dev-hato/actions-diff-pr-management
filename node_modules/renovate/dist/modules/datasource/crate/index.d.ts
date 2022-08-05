import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
import { CrateMetadata, RegistryInfo } from './types';
export declare class CrateDatasource extends Datasource {
    static readonly id = "crate";
    constructor();
    defaultRegistryUrls: string[];
    defaultVersioning: string;
    static readonly CRATES_IO_BASE_URL = "https://raw.githubusercontent.com/rust-lang/crates.io-index/master/";
    static readonly CRATES_IO_API_BASE_URL = "https://crates.io/api/v1/";
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    getCrateMetadata(info: RegistryInfo, packageName: string): Promise<CrateMetadata | null>;
    fetchCrateRecordsPayload(info: RegistryInfo, packageName: string): Promise<string>;
    /**
     * Computes the dependency URL for a crate, given
     * registry information
     */
    private static getDependencyUrl;
    /**
     * Given a Git URL, computes a semi-human-readable name for a folder in which to
     * clone the repository.
     */
    private static cacheDirFromUrl;
    /**
     * Fetches information about a registry, by url.
     * If no url is given, assumes crates.io.
     * If an url is given, assumes it's a valid Git repository
     * url and clones it to cache.
     */
    private static fetchRegistryInfo;
    private static areReleasesCacheable;
    static getIndexSuffix(packageName: string): string[];
}
