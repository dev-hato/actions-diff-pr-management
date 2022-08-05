import type { DataSource } from './types';
export declare enum GoproxyFallback {
    WhenNotFoundOrGone = ",",
    Always = "|"
}
export declare function getSourceUrl(dataSource?: DataSource | null): string | undefined;
