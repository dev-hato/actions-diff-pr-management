import type { PackageFile } from '../types';
export declare function getSliceEndNumber(start: number, numberOfLines: number, ...blocks: number[]): number;
export declare function extractPackageFile(content: string, fileName: string): PackageFile | null;
