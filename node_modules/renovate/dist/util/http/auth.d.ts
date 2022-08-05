import type { Options } from 'got';
import type { GotOptions } from './types';
export declare function applyAuthorization(inOptions: GotOptions): GotOptions;
export declare function removeAuthorization(options: Options): void;
