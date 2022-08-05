import type { RenovateConfig } from '../../../config/types';
import type { RepoFileConfig } from './types';
export declare function detectRepoFileConfig(): Promise<RepoFileConfig>;
export declare function checkForRepoConfigError(repoConfig: RepoFileConfig): void;
export declare function mergeRenovateConfig(config: RenovateConfig): Promise<RenovateConfig>;
