import type { RepoCache, RepoCacheData } from '../types';
export declare class RepoCacheBase implements RepoCache {
    protected data: RepoCacheData;
    load(): Promise<void>;
    save(): Promise<void>;
    getData(): RepoCacheData;
}
