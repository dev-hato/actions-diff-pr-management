import type { YarnLock, YarnLockEntrySummary } from './types';
export declare function getLockedDependencies(yarnLock: YarnLock, depName: string, currentVersion: string): YarnLockEntrySummary[];
