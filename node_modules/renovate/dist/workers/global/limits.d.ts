export declare enum Limit {
    Commits = "Commits",
    PullRequests = "PullRequests",
    Branches = "Branches"
}
export declare function resetAllLimits(): void;
export declare function setMaxLimit(key: Limit, val: unknown): void;
export declare function incLimitedValue(key: Limit, incBy?: number): void;
export declare function isLimitReached(key: Limit): boolean;
