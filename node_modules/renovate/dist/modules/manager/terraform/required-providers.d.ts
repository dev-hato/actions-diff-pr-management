import type { PackageDependency } from '../types';
import type { ProviderLock } from './lockfile/types';
import type { ExtractionResult } from './types';
export declare const providerBlockExtractionRegex: RegExp;
export declare function extractTerraformRequiredProviders(startingLine: number, lines: string[]): ExtractionResult;
export declare function analyzeTerraformRequiredProvider(dep: PackageDependency, locks: ProviderLock[]): void;
