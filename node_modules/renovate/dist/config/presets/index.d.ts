import type { AllConfig, RenovateConfig } from '../types';
import type { ParsedPreset } from './types';
export declare function replaceArgs(obj: string, argMapping: Record<string, any>): string;
export declare function replaceArgs(obj: string[], argMapping: Record<string, any>): string[];
export declare function replaceArgs(obj: Record<string, any>, argMapping: Record<string, any>): Record<string, any>;
export declare function replaceArgs(obj: Record<string, any>[], argMapping: Record<string, any>): Record<string, any>[];
/**
 * TODO: fix me #7154
 * @param obj
 * @param argMapping
 */
export declare function replaceArgs(obj: any, argMapping: Record<string, any>): any;
export declare function parsePreset(input: string): ParsedPreset;
export declare function getPreset(preset: string, baseConfig?: RenovateConfig): Promise<RenovateConfig>;
export declare function resolveConfigPresets(inputConfig: AllConfig, baseConfig?: RenovateConfig, _ignorePresets?: string[], existingPresets?: string[]): Promise<AllConfig>;
