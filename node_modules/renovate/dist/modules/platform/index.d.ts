import type { AllConfig } from '../../config/types';
import type { Platform } from './types';
export * from './types';
export declare const getPlatformList: () => string[];
export declare const getPlatforms: () => Map<string, Platform>;
export declare const platform: Platform;
export declare function setPlatformApi(name: string): void;
export declare function initPlatform(config: AllConfig): Promise<AllConfig>;
