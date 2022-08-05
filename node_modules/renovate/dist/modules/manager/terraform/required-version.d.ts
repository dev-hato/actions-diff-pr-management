import type { PackageDependency } from '../types';
import type { ExtractionResult } from './types';
export declare function extractTerraformRequiredVersion(startingLine: number, lines: string[]): ExtractionResult | null;
export declare function analyseTerraformVersion(dep: PackageDependency): void;
