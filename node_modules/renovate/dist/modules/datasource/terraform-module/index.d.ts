import type { GetReleasesConfig, ReleaseResult } from '../types';
import { TerraformDatasource } from './base';
export declare class TerraformModuleDatasource extends TerraformDatasource {
    static readonly id = "terraform-module";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "hashicorp";
    /**
     * This function will fetch a package from the specified Terraform registry and return all semver versions.
     *  - `sourceUrl` is supported of "source" field is set
     *  - `homepage` is set to the Terraform registry's page if it's on the official main registry
     */
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    /**
     * this uses the api that terraform registry has in addition to the base api
     * this endpoint provides more information, such as release date
     * https://www.terraform.io/registry/api-docs#latest-version-for-a-specific-module-provider
     */
    private queryRegistryExtendedApi;
    /**
     * this version uses the Module Registry Protocol that all registries are required to implement
     * https://www.terraform.io/internals/module-registry-protocol
     */
    private queryRegistryVersions;
    private static getRegistryRepository;
    private static getCacheKey;
}
