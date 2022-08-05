import type { Http } from '../../../util/http';
import type { ReleaseResult } from '../types';
export declare function getReleases(http: Http, feedUrl: string, pkgName: string): Promise<ReleaseResult | null>;
