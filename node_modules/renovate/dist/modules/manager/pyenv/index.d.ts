import { ProgrammingLanguage } from '../../../constants';
export { extractPackageFile } from './extract';
export declare const language = ProgrammingLanguage.Python;
export declare const supportedDatasources: string[];
export declare const defaultConfig: {
    fileMatch: string[];
    versioning: string;
};
