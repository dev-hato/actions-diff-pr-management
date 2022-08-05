import type { AllConfig } from '../../../config/types';
export declare function get<T = any>(namespace: string, key: string): Promise<T | undefined>;
export declare function set(namespace: string, key: string, value: unknown, minutes: number): Promise<void>;
export declare function init(config: AllConfig): Promise<void>;
export declare function cleanup(config: AllConfig): Promise<void>;
