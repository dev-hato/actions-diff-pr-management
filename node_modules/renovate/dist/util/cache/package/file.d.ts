export declare function get<T = never>(namespace: string, key: string): Promise<T | undefined>;
export declare function set(namespace: string, key: string, value: unknown, ttlMinutes?: number): Promise<void>;
export declare function init(cacheDir: string): void;
