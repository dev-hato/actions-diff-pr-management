import { Http } from '../../../../util/http';
import { TerraformProviderDatasource } from '../../../datasource/terraform-provider';
import type { TerraformBuild } from '../../../datasource/terraform-provider/types';
export declare class TerraformProviderHash {
    static http: Http<import("../../../../util/http/types").HttpOptions, import("../../../../util/http/types").HttpPostOptions>;
    static terraformDatasource: TerraformProviderDatasource;
    static hashCacheTTL: number;
    private static hashFiles;
    static hashOfZipContent(zipFilePath: string, extractPath: string): Promise<string>;
    static calculateSingleHash(build: TerraformBuild, cacheDir: string): Promise<string>;
    static calculateHashes(builds: TerraformBuild[]): Promise<string[]>;
    static createHashes(registryURL: string, repository: string, version: string): Promise<string[] | null>;
}
