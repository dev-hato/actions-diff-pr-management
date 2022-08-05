import type { PackageFile } from '../types';
export declare const packagePattern = "[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]";
export declare const dependencyPattern: string;
export declare function cleanRegistryUrls(registryUrls: string[]): string[];
export declare function extractPackageFile(content: string): PackageFile | null;
