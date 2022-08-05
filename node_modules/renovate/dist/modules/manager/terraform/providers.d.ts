import type { PackageDependency } from '../types';
import type { ProviderLock } from './lockfile/types';
import type { ExtractionResult } from './types';
export declare const sourceExtractionRegex: RegExp;
export declare function extractTerraformProvider(startingLine: number, lines: string[], moduleName: string): ExtractionResult;
export declare function analyzeTerraformProvider(dep: PackageDependency, locks: ProviderLock[]): void;
