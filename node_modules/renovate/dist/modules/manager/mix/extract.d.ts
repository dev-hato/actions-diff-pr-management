import type { PackageFile } from '../types';
export declare function extractPackageFile(content: string, fileName: string): Promise<PackageFile | null>;
