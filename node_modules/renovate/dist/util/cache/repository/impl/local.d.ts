import { RepoCacheBase } from './base';
export declare class LocalRepoCache extends RepoCacheBase {
    private platform;
    private repository;
    private oldHash;
    constructor(platform: string, repository: string);
    getCacheFileName(): string;
    load(): Promise<void>;
    save(): Promise<void>;
}
