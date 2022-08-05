import { Decorator } from '../../decorator';
declare type HashFunction<T extends any[] = any[]> = (...args: T) => string;
declare type BooleanFunction<T extends any[] = any[]> = (...args: T) => boolean;
/**
 * The cache decorator parameters.
 */
interface CacheParameters {
    /**
     * The cache namespace
     * Either a string or a hash function that generates a string
     */
    namespace: string | HashFunction;
    /**
     * The cache key
     * Either a string or a hash function that generates a string
     */
    key: string | HashFunction;
    /**
     * A function that returns true if a result is cacheable
     * Used to prevent caching of private, sensitive, results
     */
    cacheable?: BooleanFunction;
    /**
     * The TTL (or expiry) of the key in minutes
     */
    ttlMinutes?: number;
}
/**
 * caches the result of a decorated method.
 */
export declare function cache<T>({ namespace, key, cacheable, ttlMinutes, }: CacheParameters): Decorator<T>;
export {};
