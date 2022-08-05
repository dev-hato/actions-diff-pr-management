/// <reference types="node" />
import { NativePath } from '@yarnpkg/fslib';
import { URL } from 'url';
export declare function tryReadFile(path: NativePath): Promise<string | null>;
export declare function tryParseURL(str: string, base?: string | URL | undefined): URL | null;
export declare function setEntrypointPath(file: NativePath): void;
export declare function getFileFormat(filepath: string): string | null;
