import type { ExtractConfig, PackageFile } from '../../types';
import type { NpmManagerData } from '../types';
export declare function extractPackageFile(content: string, fileName: string, config: ExtractConfig): Promise<PackageFile<NpmManagerData> | null>;
export declare function postExtract(packageFiles: PackageFile[]): Promise<void>;
export declare function extractAllPackageFiles(config: ExtractConfig, packageFiles: string[]): Promise<PackageFile[]>;
