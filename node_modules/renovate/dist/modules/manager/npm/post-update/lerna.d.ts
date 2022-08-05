/// <reference types="node" />
import type { PackageFile, PostUpdateConfig } from '../../types';
import type { GenerateLockFileResult } from './types';
export declare function getLernaVersion(lernaPackageFile: Partial<PackageFile>): string;
export declare function generateLockFiles(lernaPackageFile: Partial<PackageFile>, lockFileDir: string, config: PostUpdateConfig, env: NodeJS.ProcessEnv, skipInstalls?: boolean): Promise<GenerateLockFileResult>;
