import type { PackageJson } from 'type-fest';
export interface ModuleApi {
    displayName?: string;
    url?: string;
}
export declare type RenovatePackageJson = PackageJson & {
    'engines-next': Record<string, string>;
    version: string;
};
