/**
 * Tries to detect the `platform from a url.
 *
 * @param url the url to detect platform from
 * @returns matched `platform` if found, otherwise `null`
 */
export declare function detectPlatform(url: string): 'gitlab' | 'github' | null;
