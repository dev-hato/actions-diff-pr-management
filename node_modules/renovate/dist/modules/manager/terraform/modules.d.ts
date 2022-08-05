import type { PackageDependency } from '../types';
import type { ExtractionResult } from './types';
export declare const githubRefMatchRegex: RegExp;
export declare const bitbucketRefMatchRegex: RegExp;
export declare const gitTagsRefMatchRegex: RegExp;
export declare const azureDevOpsSshRefMatchRegex: RegExp;
export declare function extractTerraformModule(startingLine: number, lines: string[], moduleName: string): ExtractionResult;
export declare function analyseTerraformModule(dep: PackageDependency): void;
