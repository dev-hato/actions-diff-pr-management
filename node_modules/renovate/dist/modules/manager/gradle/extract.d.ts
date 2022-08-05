import type { ExtractConfig, PackageFile } from '../types';
export declare function extractAllPackageFiles(config: ExtractConfig, packageFiles: string[]): Promise<PackageFile[] | null>;
