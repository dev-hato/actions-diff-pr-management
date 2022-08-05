import { TerraformDatasource } from '../terraform-module/base';
import type { GetReleasesConfig, ReleaseResult } from '../types';
import type { TerraformBuild, VersionDetailResponse } from './types';
export declare class TerraformProviderDatasource extends TerraformDatasource {
    static readonly id = "terraform-provider";
    static readonly defaultRegistryUrls: string[];
    static repositoryRegex: RegExp;
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "hashicorp";
    readonly registryStrategy = "hunt";
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    private static getRepository;
    /**
     * this uses the api that terraform registry has in addition to the base api
     * this endpoint provides more information, such as release date
     * this api is undocumented.
     */
    private queryRegistryExtendedApi;
    /**
     * this version uses the Provider Registry Protocol that all registries are required to implement
     * https://www.terraform.io/internals/provider-registry-protocol
     */
    private queryRegistryVersions;
    private queryReleaseBackend;
    getBuilds(registryURL: string, repository: string, version: string): Promise<TerraformBuild[] | null>;
    getReleaseBackendIndex(backendLookUpName: string, version: string): Promise<VersionDetailResponse>;
}
