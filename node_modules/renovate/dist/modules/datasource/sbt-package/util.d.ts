export declare function parseIndexDir(content: string, filterFn?: (x: string) => boolean): string[];
export declare function normalizeRootRelativeUrls(content: string, rootUrl: string | URL): string;
export declare function getLatestVersion(versions: string[] | null): string | null;
