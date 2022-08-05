import type { StringInterpolation, Token } from './types';
export declare function isInterpolationToken(token: Token): token is StringInterpolation;
export declare function extractRawTokens(input: string): Token[];
export declare function processTokens(tokens: Token[]): Token[];
export declare function tokenize(input: string): Token[];
