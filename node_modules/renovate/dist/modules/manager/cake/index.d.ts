import { ProgrammingLanguage } from '../../../constants';
import type { PackageFile } from '../types';
export declare const language = ProgrammingLanguage.NET;
export declare const defaultConfig: {
    fileMatch: string[];
};
export declare function extractPackageFile(content: string): PackageFile;
export declare const supportedDatasources: string[];
