import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
import type { HelmRepositoryData } from './types';
export declare class HelmDatasource extends Datasource {
    static readonly id = "helm";
    constructor();
    readonly defaultRegistryUrls: string[];
    readonly defaultConfig: {
        commitMessageTopic: string;
        group: {
            commitMessageTopic: string;
        };
    };
    readonly defaultVersioning = "helm";
    getRepositoryData(helmRepository: string): Promise<HelmRepositoryData | null>;
    getReleases({ packageName, registryUrl: helmRepository, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
