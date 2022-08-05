import type { CustomExtractConfig, PackageFile, Result } from '../types';
export declare const defaultConfig: {
    pinDigests: boolean;
};
export declare const supportedDatasources: string[];
export declare function extractPackageFile(content: string, packageFile: string, config: CustomExtractConfig): Result<PackageFile | null>;
