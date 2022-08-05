import type { XmlDocument } from 'xmldoc';
import type { Release } from '../types';
export interface MavenDependency {
    display: string;
    group?: string;
    name?: string;
    dependencyUrl: string;
}
export interface MavenXml {
    isCacheable?: boolean;
    xml?: XmlDocument;
}
export declare type ReleaseMap = Record<string, Release | null>;
export declare type HttpResourceCheckResult = 'found' | 'not-found' | 'error' | Date;
