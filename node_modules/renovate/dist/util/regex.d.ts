export declare function regEx(pattern: string | RegExp, flags?: string | undefined, useCache?: boolean): RegExp;
export declare function escapeRegExp(input: string): string;
export declare const newlineRegex: RegExp;
export declare function isConfigRegex(input: unknown): input is string;
declare type ConfigRegexPredicate = (s: string) => boolean;
export declare function configRegexPredicate(input: string): ConfigRegexPredicate | null;
export {};
