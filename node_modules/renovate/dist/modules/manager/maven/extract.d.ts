import { XmlDocument } from 'xmldoc';
import type { ExtractConfig, PackageFile } from '../types';
export declare function parsePom(raw: string): XmlDocument | null;
export declare function extractPackage(rawContent: string, packageFile?: string | null): PackageFile<Record<string, any>> | null;
export declare function extractRegistries(rawContent: string): string[];
export declare function parseSettings(raw: string): XmlDocument | null;
export declare function resolveParents(packages: PackageFile[]): PackageFile[];
export declare function extractAllPackageFiles(_config: ExtractConfig, packageFiles: string[]): Promise<PackageFile[]>;
