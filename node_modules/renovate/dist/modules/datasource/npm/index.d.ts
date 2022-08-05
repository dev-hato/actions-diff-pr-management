import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export { resetMemCache, resetCache } from './get';
export { setNpmrc } from './npmrc';
export declare class NpmDatasource extends Datasource {
    static readonly id = "npm";
    readonly customRegistrySupport = true;
    readonly registryStrategy = "first";
    readonly defaultVersioning = "npm";
    constructor();
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
