import type { Preset } from '../types';
export declare function fetchJSONFile(repo: string, fileName: string, _endpoint?: string): Promise<Preset>;
export declare function getPresetFromEndpoint(repo: string, filePreset: string, presetPath: string | undefined, endpoint: string, tag?: string | null): Promise<Preset | undefined>;
