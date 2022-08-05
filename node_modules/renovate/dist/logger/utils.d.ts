/// <reference types="node" />
import { Stream } from 'stream';
import bunyan from 'bunyan';
import type { BunyanRecord } from './types';
export declare class ProblemStream extends Stream {
    private _problems;
    readable: boolean;
    writable: boolean;
    constructor();
    write(data: BunyanRecord): boolean;
    getProblems(): BunyanRecord[];
    clearProblems(): void;
}
export default function prepareError(err: Error): Record<string, unknown>;
declare type NestedValue = unknown[] | object;
export declare function sanitizeValue(value: unknown, seen?: WeakMap<NestedValue, unknown>): any;
export declare function withSanitizer(streamConfig: bunyan.Stream): bunyan.Stream;
/**
 * A function that terminates exeution if the log level that was entered is
 *  not a valid value for the Bunyan logger.
 * @param logLevelToCheck
 * @returns returns undefined when the logLevelToCheck is valid. Else it stops execution.
 */
export declare function validateLogLevel(logLevelToCheck: string | undefined): void;
export declare function sanitizeUrls(text: string): string;
export {};
