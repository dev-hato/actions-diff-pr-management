import moo from 'moo';
import { Datasource } from '../datasource';
import type { GetReleasesConfig, Release, ReleaseResult } from '../types';
import { GoDirectDatasource } from './releases-direct';
import type { GoproxyItem } from './types';
export declare class GoProxyDatasource extends Datasource {
    static readonly id = "go-proxy";
    constructor();
    readonly direct: GoDirectDatasource;
    getReleases(config: GetReleasesConfig): Promise<ReleaseResult | null>;
    /**
     * Parse `GOPROXY` to the sequence of url + fallback strategy tags.
     *
     * @example
     * parseGoproxy('foo.example.com|bar.example.com,baz.example.com')
     * // [
     * //   { url: 'foo.example.com', fallback: '|' },
     * //   { url: 'bar.example.com', fallback: ',' },
     * //   { url: 'baz.example.com', fallback: '|' },
     * // ]
     *
     * @see https://golang.org/ref/mod#goproxy-protocol
     */
    parseGoproxy(input?: string | undefined): GoproxyItem[];
    static lexer: moo.Lexer;
    static parsedNoproxy: Record<string, RegExp | null>;
    static parseNoproxy(input?: unknown): RegExp | null;
    /**
     * Avoid ambiguity when serving from case-insensitive file systems.
     *
     * @see https://golang.org/ref/mod#goproxy-protocol
     */
    encodeCase(input: string): string;
    listVersions(baseUrl: string, packageName: string): Promise<string[]>;
    versionInfo(baseUrl: string, packageName: string, version: string): Promise<Release>;
    static getCacheKey({ packageName }: GetReleasesConfig): string;
}
