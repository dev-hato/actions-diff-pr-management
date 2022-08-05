import _parseLinkHeader from 'parse-link-header';
export declare function joinUrlParts(...parts: string[]): string;
export declare function ensurePathPrefix(url: string, prefix: string): string;
export declare function ensureTrailingSlash(url: string): string;
export declare function trimTrailingSlash(url: string): string;
export declare function trimLeadingSlash(path: string): string;
export declare function resolveBaseUrl(baseUrl: string, input: string | URL): string;
export declare function getQueryString(params: Record<string, any>): string;
export declare function validateUrl(url?: string, httpOnly?: boolean): boolean;
export declare function parseUrl(url: string | undefined | null): URL | null;
/**
 * Tries to create an URL object from either a full URL string or a hostname
 * @param url either the full url or a hostname
 * @returns an URL object or null
 */
export declare function createURLFromHostOrURL(url: string): URL | null;
export declare type LinkHeaderLinks = _parseLinkHeader.Links;
export declare function parseLinkHeader(linkHeader: string | null | undefined): LinkHeaderLinks | null;
