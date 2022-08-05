import type { RenovateConfig } from '../../../config/types';
import type { PackageFile } from '../../../modules/manager/types';
export declare function extractAllDependencies(config: RenovateConfig): Promise<Record<string, PackageFile[]>>;
