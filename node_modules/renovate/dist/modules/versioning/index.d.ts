import type { VersioningApi, VersioningApiConstructor } from './types';
export * from './types';
export declare const getVersioningList: () => string[];
/**
 * Get versioning map. Can be used to dynamically add new versioning type
 */
export declare const getVersionings: () => Map<string, VersioningApi | VersioningApiConstructor>;
export declare function get(versioning: string | undefined): VersioningApi;
