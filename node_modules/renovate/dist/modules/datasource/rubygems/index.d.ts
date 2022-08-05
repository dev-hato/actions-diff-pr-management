import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class RubyGemsDatasource extends Datasource {
    static readonly id = "rubygems";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly defaultVersioning = "ruby";
    readonly registryStrategy = "hunt";
    private readonly rubyGemsOrgDatasource;
    private readonly internalRubyGemsDatasource;
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
