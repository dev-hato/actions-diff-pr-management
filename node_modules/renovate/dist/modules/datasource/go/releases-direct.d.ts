import { Datasource } from '../datasource';
import { GithubTagsDatasource } from '../github-tags';
import type { DatasourceApi, GetReleasesConfig, ReleaseResult } from '../types';
export declare class GoDirectDatasource extends Datasource {
    static readonly id = "go-direct";
    github: GithubTagsDatasource;
    gitlab: DatasourceApi;
    bitbucket: DatasourceApi;
    constructor();
    /**
     * go.getReleases
     *
     * This datasource resolves a go module URL into its source repository
     *  and then fetch it if it is on GitHub.
     *
     * This function will:
     *  - Determine the source URL for the module
     *  - Call the respective getReleases in github/gitlab to retrieve the tags
     *  - Filter module tags according to the module path
     */
    getReleases(config: GetReleasesConfig): Promise<ReleaseResult | null>;
}
