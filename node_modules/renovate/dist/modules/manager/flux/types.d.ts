export interface KubernetesResource {
    apiVersion: string;
    metadata: {
        name: string;
        namespace: string;
    };
}
export interface HelmRelease extends KubernetesResource {
    kind: 'HelmRelease';
    spec: {
        chart: {
            spec: {
                chart: string;
                sourceRef: {
                    kind: string;
                    name: string;
                    namespace?: string;
                };
                version?: string;
            };
        };
    };
}
export interface HelmRepository extends KubernetesResource {
    kind: 'HelmRepository';
    spec: {
        url: string;
    };
}
export declare type FluxResource = HelmRelease | HelmRepository;
export interface FluxFile {
    file: string;
}
export interface ResourceFluxManifest extends FluxFile {
    kind: 'resource';
    releases: HelmRelease[];
    repositories: HelmRepository[];
}
export interface SystemFluxManifest extends FluxFile {
    kind: 'system';
    version: string;
    components: string;
}
export declare type FluxManifest = ResourceFluxManifest | SystemFluxManifest;
