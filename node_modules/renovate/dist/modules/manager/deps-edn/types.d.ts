export declare type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;
export declare type TokenTypes<T> = keyof UnionToIntersection<T[keyof T]>;
export declare type ParsedEdnPrimitive = string | null;
export declare type ParsedEdnArray = ParsedEdnData[];
export declare type ParsedEdnRecord = {
    [k: string]: ParsedEdnData;
};
export declare type ParsedEdnData = ParsedEdnPrimitive | ParsedEdnRecord | ParsedEdnArray;
export declare type ParserState = {
    type: 'root';
    data: ParsedEdnData;
} | {
    type: 'array';
    startIndex: number;
    data: ParsedEdnArray;
} | {
    type: 'record';
    skipKey: boolean;
    currentKey: string | null;
    startIndex: number;
    data: ParsedEdnRecord;
};
export interface EdnMetadata {
    replaceString: string;
}
export declare type ParsedEdnMetadata = WeakMap<ParsedEdnRecord | ParsedEdnArray, EdnMetadata>;
export interface ParsedEdnResult {
    data: ParsedEdnRecord;
    metadata: ParsedEdnMetadata;
}
