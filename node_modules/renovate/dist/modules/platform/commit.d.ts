import type { CommitFilesConfig, CommitSha } from '../../util/git/types';
export declare function commitAndPush(commitConfig: CommitFilesConfig): Promise<CommitSha | null>;
