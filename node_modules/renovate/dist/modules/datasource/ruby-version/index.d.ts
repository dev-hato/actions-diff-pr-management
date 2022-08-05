import type { HttpError } from '../../../util/http';
import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class RubyVersionDatasource extends Datasource {
    static readonly id = "ruby-version";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly customRegistrySupport = false;
    readonly defaultVersioning = "ruby";
    getReleases({ registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    handleSpecificErrors(err: HttpError): never | void;
}
