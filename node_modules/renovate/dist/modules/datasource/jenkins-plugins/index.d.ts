import { Datasource } from '../datasource';
import type { GetReleasesConfig, Release, ReleaseResult } from '../types';
export declare class JenkinsPluginsDatasource extends Datasource {
    static readonly id = "jenkins-plugins";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly registryStrategy = "hunt";
    private static readonly packageInfoUrl;
    private static readonly packageVersionsUrl;
    getReleases({ packageName, }: GetReleasesConfig): Promise<ReleaseResult | null>;
    getJenkinsPluginInfo(): Promise<Record<string, ReleaseResult>>;
    getJenkinsPluginVersions(): Promise<Record<string, Release[]>>;
    private getJenkinsUpdateCenterResponse;
}
