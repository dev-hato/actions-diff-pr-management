import type { HostRule, HostRuleSearchResult } from '../types';
export declare function add(params: HostRule): void;
export interface HostRuleSearch {
    hostType?: string;
    url?: string;
}
export declare function find(search: HostRuleSearch): HostRuleSearchResult;
export declare function hosts({ hostType }: {
    hostType: string;
}): string[];
export declare function hostType({ url }: {
    url: string;
}): string | null;
export declare function findAll({ hostType }: {
    hostType: string;
}): HostRule[];
/**
 * @returns a deep copy of all known host rules without any filtering
 */
export declare function getAll(): HostRule[];
export declare function clear(): void;
