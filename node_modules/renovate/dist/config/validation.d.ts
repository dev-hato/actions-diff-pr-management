import type { RenovateConfig, ValidationResult } from './types';
export declare function getParentName(parentPath: string | undefined): string;
export declare function validateConfig(config: RenovateConfig, isPreset?: boolean, parentPath?: string): Promise<ValidationResult>;
