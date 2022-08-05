import { GitlabHttp } from '../../../util/http/gitlab';
import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class GitlabPackagesDatasource extends Datasource {
    static readonly id = "gitlab-packages";
    protected http: GitlabHttp;
    caching: boolean;
    customRegistrySupport: boolean;
    defaultRegistryUrls: string[];
    constructor();
    static getGitlabPackageApiUrl(registryUrl: string, projectName: string, packageName: string): string;
    getReleases({ registryUrl, packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
