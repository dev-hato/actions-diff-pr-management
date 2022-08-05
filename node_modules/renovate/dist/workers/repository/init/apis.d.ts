import type { RenovateConfig } from '../../../config/types';
import { RepoResult } from '../../../modules/platform';
export declare type WorkerPlatformConfig = RepoResult & RenovateConfig & Record<string, any>;
export declare function initApis(input: RenovateConfig): Promise<WorkerPlatformConfig>;
