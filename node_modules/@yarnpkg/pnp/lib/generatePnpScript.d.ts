import { PnpSettings } from './types';
export declare function generateLoader(shebang: string | null | undefined, loader: string): string;
export declare function generateInlinedScript(settings: PnpSettings): string;
export declare function generateSplitScript(settings: PnpSettings & {
    dataLocation: string;
}): {
    dataFile: string;
    loaderFile: string;
};
