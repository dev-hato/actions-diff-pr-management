import type { GithubHttp } from '../../../../util/http/github';
import { AbstractGithubDatasourceCache } from './cache-base';
import type { CacheOptions, StoredItemBase } from './types';
export declare const query = "\nquery ($owner: String!, $name: String!, $cursor: String, $count: Int!) {\n  repository(owner: $owner, name: $name) {\n    payload: releases(\n      first: $count\n      after: $cursor\n      orderBy: {field: CREATED_AT, direction: DESC}\n    ) {\n      nodes {\n        version: tagName\n        releaseTimestamp: publishedAt\n        isDraft\n        isPrerelease\n        url\n        id: databaseId\n        name\n        description\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}\n";
export interface FetchedRelease {
    version: string;
    releaseTimestamp: string;
    isDraft: boolean;
    isPrerelease: boolean;
    url: string;
    id: number;
    name: string;
    description: string;
}
export interface StoredRelease extends StoredItemBase {
    isStable?: boolean;
    url: string;
    id: number;
    name: string;
    description: string;
}
export declare class CacheableGithubReleases extends AbstractGithubDatasourceCache<StoredRelease, FetchedRelease> {
    cacheNs: string;
    graphqlQuery: string;
    constructor(http: GithubHttp, opts?: CacheOptions);
    coerceFetched(item: FetchedRelease): StoredRelease | null;
}
