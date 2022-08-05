import { Http } from '../../../util/http';
import type { ReleaseResult } from '../types';
export declare function getResourceUrl(http: Http, url: string, resourceType?: string): Promise<string | null>;
export declare function getReleases(http: Http, registryUrl: string, feedUrl: string, pkgName: string): Promise<ReleaseResult | null>;
