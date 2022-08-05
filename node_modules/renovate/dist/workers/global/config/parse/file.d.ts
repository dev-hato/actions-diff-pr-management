/// <reference types="node" />
import type { AllConfig, RenovateConfig } from '../../../../config/types';
export declare function getParsedContent(file: string): Promise<RenovateConfig>;
export declare function getConfig(env: NodeJS.ProcessEnv): Promise<AllConfig>;
