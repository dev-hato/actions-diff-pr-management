import type { FileChange } from './types';
export declare function checkForPlatformFailure(err: Error): Error | null;
export declare function handleCommitError(files: FileChange[], branchName: string, err: Error): null;
