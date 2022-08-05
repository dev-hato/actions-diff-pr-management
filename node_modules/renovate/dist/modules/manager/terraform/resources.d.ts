import type { PackageDependency } from '../types';
import type { ExtractionResult, ResourceManagerData } from './types';
export declare function extractTerraformResource(startingLine: number, lines: string[]): ExtractionResult;
export declare function analyseTerraformResource(dep: PackageDependency<ResourceManagerData>): void;
