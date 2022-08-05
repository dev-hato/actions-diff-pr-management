import type { Release } from '../../../../modules/datasource';
import type { LookupUpdate } from '../../../../modules/manager/types';
import type { VersioningApi } from '../../../../modules/versioning';
import type { RangeStrategy } from '../../../../types';
import type { LookupUpdateConfig } from './types';
export declare function generateUpdate(config: LookupUpdateConfig, versioning: VersioningApi, rangeStrategy: RangeStrategy, currentVersion: string, bucket: string, release: Release): LookupUpdate;
