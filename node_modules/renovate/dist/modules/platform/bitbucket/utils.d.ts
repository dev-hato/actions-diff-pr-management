import type { MergeStrategy } from '../../../config/types';
import { BranchStatus } from '../../../types';
import type { HttpOptions, HttpPostOptions } from '../../../util/http/types';
import type { Pr } from '../types';
import type { MergeRequestBody } from './types';
export interface Config {
    defaultBranch: string;
    has_issues: boolean;
    mergeMethod: string;
    owner: string;
    prList: Pr[];
    repository: string;
    username: string;
    userUuid: string;
    ignorePrAuthor: boolean;
}
export interface PagedResult<T = any> {
    pagelen: number;
    size?: number;
    next?: string;
    values: T[];
}
export interface RepoInfo {
    isFork: boolean;
    owner: string;
    mainbranch: string;
    mergeMethod: string;
    has_issues: boolean;
}
export declare type BitbucketBranchState = 'SUCCESSFUL' | 'FAILED' | 'INPROGRESS';
export interface BitbucketStatus {
    key: string;
    state: BitbucketBranchState;
}
export interface RepoInfoBody {
    parent?: any;
    owner: {
        username: string;
    };
    mainbranch: {
        name: string;
    };
    has_issues: boolean;
}
export declare function repoInfoTransformer(repoInfoBody: RepoInfoBody): RepoInfo;
export declare function mergeBodyTransformer(mergeStrategy: MergeStrategy | undefined): MergeRequestBody;
export declare const prStates: {
    open: string[];
    notOpen: string[];
    merged: string[];
    closed: string[];
    all: string[];
};
export declare const buildStates: Record<BranchStatus, BitbucketBranchState>;
export declare function accumulateValues<T = any>(reqUrl: string, method?: string, options?: HttpOptions | HttpPostOptions, pagelen?: number): Promise<T[]>;
export interface PrResponse {
    id: number;
    title: string;
    state: string;
    links: {
        commits: {
            href: string;
        };
    };
    summary?: {
        raw: string;
    };
    source: {
        branch: {
            name: string;
        };
    };
    destination: {
        branch: {
            name: string;
        };
    };
    reviewers: Array<Account>;
    created_on: string;
}
export declare function prInfo(pr: PrResponse): Pr;
export interface Account {
    display_name?: string;
    uuid: string;
    nickname?: string;
    account_status?: string;
}
