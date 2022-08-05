import { GithubHttp } from '../../../util/http/github';
import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class ConanDatasource extends Datasource {
    static readonly id = "conan";
    readonly defaultRegistryUrls: string[];
    readonly caching = true;
    readonly registryStrategy = "merge";
    githubHttp: GithubHttp;
    constructor(id?: string);
    getConanCenterReleases(depName: string, userAndChannel: string): Promise<ReleaseResult | null>;
    getReleases({ registryUrl, packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
