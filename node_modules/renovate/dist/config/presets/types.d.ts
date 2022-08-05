import type { RenovateConfig } from '../types';
export declare type Preset = RenovateConfig & Record<string, unknown>;
export declare type PresetConfig = {
    repo: string;
    presetPath?: string;
    presetName?: string;
    tag?: string;
};
export interface PresetApi {
    getPreset(config: PresetConfig): Promise<Preset | null | undefined> | Preset | null | undefined;
}
export interface ParsedPreset {
    presetSource: string;
    repo: string;
    presetPath?: string;
    presetName: string;
    tag?: string;
    params?: string[];
}
export declare type PresetFetcher = (repo: string, fileName: string, endpoint: string, tag?: string | null) => Promise<Preset | null | undefined>;
export declare type FetchPresetConfig = {
    repo: string;
    filePreset: string;
    presetPath?: string;
    endpoint: string;
    tag?: string | null;
    fetch: PresetFetcher;
};
