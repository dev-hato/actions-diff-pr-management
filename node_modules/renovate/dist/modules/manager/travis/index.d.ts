import { ProgrammingLanguage } from '../../../constants';
export { extractPackageFile } from './extract';
export declare const language = ProgrammingLanguage.NodeJS;
export declare const supportedDatasources: string[];
export declare const defaultConfig: {
    fileMatch: string[];
    major: {
        enabled: boolean;
    };
    versioning: string;
};
