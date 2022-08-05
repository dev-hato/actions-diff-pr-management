import type { LockFile, ParseLockFileResult } from './types';
export declare function parseLockFile(lockFile: string): ParseLockFileResult;
export declare function composeLockFile(lockFile: LockFile, indent: string): string;
