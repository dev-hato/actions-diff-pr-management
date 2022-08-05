/// <reference types="node" />
import type { PostUpdateConfig, Upgrade } from '../../types';
import type { GenerateLockFileResult } from './types';
export declare function generateLockFile(lockFileDir: string, env: NodeJS.ProcessEnv, config: PostUpdateConfig, upgrades?: Upgrade[]): Promise<GenerateLockFileResult>;
