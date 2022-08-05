/// <reference types="node" />
import type { AllConfig } from '../../../../config/types';
import type { ParseConfigOptions } from './types';
export declare function getEnvName(option: ParseConfigOptions): string;
export declare function getConfig(inputEnv: NodeJS.ProcessEnv): AllConfig;
