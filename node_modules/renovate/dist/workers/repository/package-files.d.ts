import type { RenovateConfig } from '../../config/types';
import type { PackageFile } from '../../modules/manager/types';
export declare class PackageFiles {
    private static data;
    static add(baseBranch: string, packageFiles: Record<string, PackageFile[]> | null): void;
    static clear(): void;
    static getDashboardMarkdown(config: RenovateConfig): string;
}
