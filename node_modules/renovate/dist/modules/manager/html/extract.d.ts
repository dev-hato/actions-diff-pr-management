import type { PackageDependency, PackageFile } from '../types';
export declare function extractDep(tag: string): PackageDependency | null;
export declare function extractPackageFile(content: string): PackageFile | null;
