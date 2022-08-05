import { RequestError as HttpError } from 'got';
export declare type GotLegacyError<E = unknown, T = unknown> = HttpError & {
    statusCode?: number;
    body: {
        message?: string;
        errors?: E[];
    };
    headers?: Record<string, T>;
};
