import type { HttpOptions, HttpResponse, InternalHttpOptions } from './types';
import { Http } from '.';
export declare const setBaseUrl: (url: string) => void;
export declare class BitbucketHttp extends Http {
    constructor(type?: string, options?: HttpOptions);
    protected request<T>(url: string | URL, options?: InternalHttpOptions): Promise<HttpResponse<T>>;
}
