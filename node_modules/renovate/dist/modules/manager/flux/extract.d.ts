import type { ExtractConfig, PackageFile } from '../types';
export declare function extractPackageFile(content: string, packageFile: string): PackageFile | null;
export declare function extractAllPackageFiles(_config: ExtractConfig, packageFiles: string[]): Promise<PackageFile[] | null>;
