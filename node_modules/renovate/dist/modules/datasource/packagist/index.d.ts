import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
import type { AllPackages, PackagistFile, RegistryFile } from './types';
export declare class PackagistDatasource extends Datasource {
    static readonly id = "packagist";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "composer";
    readonly registryStrategy = "hunt";
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    private static getHostOpts;
    private getRegistryMeta;
    private static isPrivatePackage;
    private static getPackagistFileUrl;
    getPackagistFile(regUrl: string, regFile: RegistryFile): Promise<PackagistFile>;
    private static extractDepReleases;
    getAllPackages(regUrl: string): Promise<AllPackages | null>;
    packagistOrgLookup(name: string): Promise<ReleaseResult | null>;
    private packageLookup;
}
