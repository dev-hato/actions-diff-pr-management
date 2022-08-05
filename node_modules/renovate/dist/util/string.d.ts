export declare function matchAt(content: string, index: number, match: string): boolean;
export declare function replaceAt(content: string, index: number, oldString: string, newString: string): string;
/**
 * Converts from utf-8 string to base64-encoded string
 */
export declare function toBase64(input: string): string;
/**
 * Converts from base64-encoded string to utf-8 string
 */
export declare function fromBase64(input: string): string;
export declare function uniqueStrings(element: string, index: number, elements: string[]): boolean;
