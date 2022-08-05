import type { VersioningApi } from '../../../../modules/versioning/types';
export declare function getCurrentVersion(currentValue: string, lockedVersion: string, versioning: VersioningApi, rangeStrategy: string, latestVersion: string, allVersions: string[]): string | null;
