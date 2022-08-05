import { Http, HttpError } from '../../../util/http';
import type { HttpResponse, OutgoingHttpHeaders } from '../../../util/http/types';
import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
import { RegistryRepository } from './types';
export declare const DOCKER_HUB = "https://index.docker.io";
export declare const ecrRegex: RegExp;
export declare function getAuthHeaders(http: Http, registryHost: string, dockerRepository: string, apiCheckUrl?: string): Promise<OutgoingHttpHeaders | null>;
export declare function getRegistryRepository(packageName: string, registryUrl: string): RegistryRepository;
export declare function extractDigestFromResponseBody(manifestResponse: HttpResponse): string;
export declare function isECRMaxResultsError(err: HttpError): boolean;
export declare const defaultConfig: {
    commitMessageTopic: string;
    commitMessageExtra: string;
    digest: {
        branchTopic: string;
        commitMessageExtra: string;
        commitMessageTopic: string;
        group: {
            commitMessageTopic: string;
            commitMessageExtra: string;
        };
    };
    pin: {
        commitMessageExtra: string;
        groupName: string;
        group: {
            commitMessageTopic: string;
            branchTopic: string;
        };
    };
    group: {
        commitMessageTopic: string;
    };
};
export declare class DockerDatasource extends Datasource {
    static readonly id = "docker";
    readonly defaultVersioning = "docker";
    readonly defaultRegistryUrls: string[];
    constructor();
    private getManifestResponse;
    private getConfigDigest;
    getLabels(registryHost: string, dockerRepository: string, tag: string): Promise<Record<string, string>>;
    private getTagsQuayRegistry;
    private getDockerApiTags;
    getTags(registryHost: string, dockerRepository: string): Promise<string[] | null>;
    /**
     * docker.getDigest
     *
     * The `newValue` supplied here should be a valid tag for the docker image.
     *
     * This function will:
     *  - Look up a sha256 digest for a tag on its registry
     *  - Return the digest as a string
     */
    getDigest({ registryUrl, packageName }: GetReleasesConfig, newValue?: string): Promise<string | null>;
    /**
     * docker.getReleases
     *
     * A docker image usually looks something like this: somehost.io/owner/repo:8.1.0-alpine
     * In the above:
     *  - 'somehost.io' is the registry
     *  - 'owner/repo' is the package name
     *  - '8.1.0-alpine' is the tag
     *
     * This function will filter only tags that contain a semver version
     */
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
