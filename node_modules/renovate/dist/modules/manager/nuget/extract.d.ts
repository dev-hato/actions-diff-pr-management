import type { ExtractConfig, PackageFile } from '../types';
export declare function extractPackageFile(content: string, packageFile: string, config: ExtractConfig): Promise<PackageFile | null>;
