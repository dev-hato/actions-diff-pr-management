declare const PREFIX_DOT = "PREFIX_DOT";
declare const PREFIX_HYPHEN = "PREFIX_HYPHEN";
declare const TYPE_NUMBER = "TYPE_NUMBER";
declare const TYPE_QUALIFIER = "TYPE_QUALIFIER";
export interface BaseToken {
    prefix: string;
    type: typeof TYPE_NUMBER | typeof TYPE_QUALIFIER;
    val: number | string;
    isTransition?: boolean;
}
export interface NumberToken extends BaseToken {
    type: typeof TYPE_NUMBER;
    val: number;
}
export interface QualifierToken extends BaseToken {
    type: typeof TYPE_QUALIFIER;
    val: string;
}
export declare type Token = NumberToken | QualifierToken;
declare function tokenize(versionStr: string, preserveMinorZeroes?: boolean): Token[];
export declare enum QualifierTypes {
    Alpha = 1,
    Beta = 2,
    Milestone = 3,
    RC = 4,
    Snapshot = 5,
    Release = 6,
    SP = 7
}
export declare function qualifierType(token: Token): number | null;
declare function compare(left: string, right: string): number;
declare function isVersion(version: unknown): version is string;
declare const INCLUDING_POINT = "INCLUDING_POINT";
declare const EXCLUDING_POINT = "EXCLUDING_POINT";
declare function parseRange(rangeStr: string): Range[] | null;
declare function isValid(str: string): boolean;
export interface Range {
    leftType: typeof INCLUDING_POINT | typeof EXCLUDING_POINT | null;
    leftValue: string | null;
    leftBracket: string | null;
    rightType: typeof INCLUDING_POINT | typeof EXCLUDING_POINT | null;
    rightValue: string | null;
    rightBracket: string | null;
}
declare function rangeToStr(fullRange: Range[] | null): string | null;
declare function autoExtendMavenRange(currentRepresentation: string, newValue: string): string | null;
declare function isSubversion(majorVersion: string, minorVersion: string): boolean;
export { PREFIX_DOT, PREFIX_HYPHEN, TYPE_NUMBER, TYPE_QUALIFIER, tokenize, isSubversion, compare, isVersion, isVersion as isSingleVersion, isValid, parseRange, rangeToStr, INCLUDING_POINT, EXCLUDING_POINT, autoExtendMavenRange, };
