import type { Preset } from '../types';
export declare type Replacement = [string[], string];
export interface AutoPackageRules {
    matchCurrentVersion: string;
    matchDatasources: string[];
    replacements: Replacement[];
    replacementVersion: string;
}
export interface PresetTemplate {
    title: string;
    description: string;
    packageRules: AutoPackageRules;
}
export declare function addPresets(presets: Record<string, Preset>, template: PresetTemplate): void;
