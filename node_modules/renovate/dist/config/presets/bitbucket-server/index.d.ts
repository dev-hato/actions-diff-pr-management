import type { Preset } from '../types';
export declare function fetchJSONFile(repo: string, fileName: string, endpoint: string, branchOrTag?: string | null): Promise<Preset | null>;
export declare function getPresetFromEndpoint(repo: string, filePreset: string, presetPath: string | undefined, endpoint: string, tag?: string | null): Promise<Preset | undefined>;
