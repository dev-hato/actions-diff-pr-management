import type { NewValueConfig, VersioningApi } from './types';
export interface GenericVersion {
    release: number[];
    /** prereleases are treated in the standard semver manner, if present */
    prerelease?: string;
    suffix?: string;
}
export interface VersionParser {
    (version: string): GenericVersion;
}
export interface VersionComparator {
    (version: string, other: string): number;
}
export declare abstract class GenericVersioningApi<T extends GenericVersion = GenericVersion> implements VersioningApi {
    private _getSection;
    protected _compare(version: string, other: string): number;
    protected _compareOther(_left: T, _right: T): number;
    protected abstract _parse(version: string): T | null;
    isValid(version: string): boolean;
    isCompatible(version: string, _current: string): boolean;
    isStable(version: string): boolean;
    isSingleVersion(version: string): boolean;
    isVersion(version: string): boolean;
    getMajor(version: string): number | null;
    getMinor(version: string): number | null;
    getPatch(version: string): number | null;
    equals(version: string, other: string): boolean;
    isGreaterThan(version: string, other: string): boolean;
    isLessThanRange(version: string, range: string): boolean;
    getSatisfyingVersion(versions: string[], range: string): string | null;
    minSatisfyingVersion(versions: string[], range: string): string | null;
    getNewValue(newValueConfig: NewValueConfig): string;
    sortVersions(version: string, other: string): number;
    matches(version: string, range: string): boolean;
}
