import type { PackageFile } from '../../types';
export declare function extractPnpmFilters(fileName: string): Promise<string[] | undefined>;
export declare function findPnpmWorkspace(packageFile: string): Promise<{
    lockFilePath: string;
    workspaceYamlPath: string;
} | null>;
export declare function detectPnpmWorkspaces(packageFiles: Partial<PackageFile>[]): Promise<void>;
