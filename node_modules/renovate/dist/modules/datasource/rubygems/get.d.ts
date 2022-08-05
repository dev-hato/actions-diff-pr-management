import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class InternalRubyGemsDatasource extends Datasource {
    readonly id: string;
    constructor(id: string);
    private knownFallbackHosts;
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    getDependencyFallback(dependency: string, registry: string): Promise<ReleaseResult | null>;
    getDependency(dependency: string, registry: string): Promise<ReleaseResult | null>;
    private fetchJson;
    private fetchBuffer;
}
