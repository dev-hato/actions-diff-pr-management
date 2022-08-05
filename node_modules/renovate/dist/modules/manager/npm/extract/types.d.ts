import type { PackageJson } from 'type-fest';
export declare type NpmPackageDependency = PackageJson.Dependency;
export declare type DependenciesMeta = Record<string, {
    optional: boolean;
    built: boolean;
    unplugged: boolean;
}>;
export interface NpmPackage extends PackageJson {
    renovate?: unknown;
    _from?: any;
    _args?: any;
    _id?: any;
    dependenciesMeta?: DependenciesMeta;
    packageManager?: string;
    overrides?: OverrideDependency;
    volta?: PackageJson.Dependency;
}
export declare type LockFileEntry = Record<string, {
    version: string;
    integrity?: boolean;
}>;
export interface LockFile {
    lockedVersions: Record<string, string>;
    lockfileVersion?: number;
    isYarn1?: boolean;
}
export interface PnpmWorkspaceFile {
    packages: string[];
}
export declare type OverrideDependency = Record<string, RecursiveOverride>;
export declare type RecursiveOverride = string | {
    [_: string]: RecursiveOverride;
};
