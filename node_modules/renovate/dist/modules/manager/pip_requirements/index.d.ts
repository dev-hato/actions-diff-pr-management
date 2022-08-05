import { ProgrammingLanguage } from '../../../constants';
export { updateArtifacts } from './artifacts';
export { extractPackageFile } from './extract';
export { getRangeStrategy } from './range';
export declare const language = ProgrammingLanguage.Python;
export declare const defaultConfig: {
    fileMatch: string[];
};
export declare const supportedDatasources: string[];
