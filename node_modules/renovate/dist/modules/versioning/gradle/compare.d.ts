export declare enum TokenType {
    Number = 1,
    String = 2
}
declare type Token = {
    type: TokenType;
    val: string | number;
};
export declare function tokenize(versionStr: string): Token[] | null;
export declare enum QualifierRank {
    Dev = -1,
    Default = 0,
    RC = 1,
    Snapshot = 2,
    Final = 3,
    GA = 4,
    Release = 5,
    SP = 6
}
export declare function qualifierRank(input: string): number;
export declare function compare(left: string, right: string): number;
export declare function parse(input: string): Token[] | null;
export declare function isVersion(input: string): boolean;
interface PrefixRange {
    tokens: Token[];
}
export declare enum RangeBound {
    Inclusive = 1,
    Exclusive = 2
}
interface MavenBasedRange {
    leftBound: RangeBound;
    leftBoundStr: string;
    leftVal: string | null;
    separator: string;
    rightBound: RangeBound;
    rightBoundStr: string;
    rightVal: string | null;
}
export declare function parsePrefixRange(input: string): PrefixRange | null;
export declare function parseMavenBasedRange(input: string): MavenBasedRange | null;
export declare function isValid(str: string): boolean;
export {};
