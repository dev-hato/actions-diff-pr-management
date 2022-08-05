import type { ParsedRegistryUrl } from './types';
export declare function removeBuildMeta(version: string): string;
export declare function massageUrl(url: string): string;
export declare function parseRegistryUrl(registryUrl: string): ParsedRegistryUrl;
