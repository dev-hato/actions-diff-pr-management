import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare function resetCache(): void;
export declare class RubyGemsOrgDatasource extends Datasource {
    readonly id: string;
    constructor(id: string);
    getReleases({ packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    /**
     * https://bugs.chromium.org/p/v8/issues/detail?id=2869
     */
    private static copystr;
    updateRubyGemsVersions(): Promise<void>;
    private static processLine;
    private static isDataStale;
    private updateRubyGemsVersionsPromise;
    syncVersions(): Promise<void>;
}
