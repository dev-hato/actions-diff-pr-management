import type { ExtractConfig, PackageFile } from '../types';
export declare function extractPackageFile(content: string, fileName: string, config: ExtractConfig): Promise<PackageFile | null>;
