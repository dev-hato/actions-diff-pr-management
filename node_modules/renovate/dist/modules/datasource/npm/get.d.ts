import type { Http } from '../../../util/http';
import type { NpmDependency } from './types';
export declare function resetMemCache(): void;
export declare function resetCache(): void;
export declare function getDependency(http: Http, registryUrl: string, packageName: string): Promise<NpmDependency | null>;
