import type { RepoCacheData, RepoCacheRecord } from './types';
export declare const CACHE_REVISION = 12;
export declare function isValidRev10(input: unknown, repo?: string): input is RepoCacheData & {
    repository?: string;
    revision?: number;
};
export declare function isValidRev11(input: unknown, repo?: string): input is {
    repository: string;
    revision: number;
    data: RepoCacheData;
};
export declare function isValidRev12(input: unknown, repo?: string): input is RepoCacheRecord;
