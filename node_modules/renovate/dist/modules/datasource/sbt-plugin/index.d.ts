import { SbtPackageDatasource } from '../sbt-package';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare const SBT_PLUGINS_REPO = "https://dl.bintray.com/sbt/sbt-plugin-releases";
export declare const defaultRegistryUrls: string[];
export declare class SbtPluginDatasource extends SbtPackageDatasource {
    static readonly id = "sbt-plugin";
    readonly defaultRegistryUrls: string[];
    readonly registryStrategy = "hunt";
    readonly defaultVersioning = "ivy";
    constructor();
    resolvePluginReleases(rootUrl: string, artifact: string, scalaVersion: string): Promise<string[] | null>;
    getReleases({ packageName, registryUrl, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
