import type { PackageDependency, PackageFile } from '../types';
import type { ParsedLine } from './types';
export declare function parseLine(line: string): ParsedLine;
export declare function gitDep(parsedLine: ParsedLine): PackageDependency | null;
export declare function extractPackageFile(content: string, fileName: string): Promise<PackageFile | null>;
