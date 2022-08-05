import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class PypiDatasource extends Datasource {
    static readonly id = "pypi";
    constructor();
    readonly caching = true;
    readonly customRegistrySupport = true;
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "pep440";
    readonly registryStrategy = "merge";
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    private static normalizeName;
    private static normalizeNameForUrlLookup;
    private getDependency;
    private static extractVersionFromLinkText;
    private static cleanSimpleHtml;
    private getSimpleDependency;
}
