/// <reference types="node" />
import type { PostUpdateConfig, Upgrade } from '../../types';
import type { GenerateLockFileResult } from './types';
export declare function generateLockFile(lockFileDir: string, env: NodeJS.ProcessEnv, filename: string, config?: Partial<PostUpdateConfig>, upgrades?: Upgrade[]): Promise<GenerateLockFileResult>;
