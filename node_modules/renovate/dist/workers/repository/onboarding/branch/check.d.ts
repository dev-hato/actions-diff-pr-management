import type { RenovateConfig } from '../../../../config/types';
export declare type Pr = any;
export declare const isOnboarded: (config: RenovateConfig) => Promise<boolean>;
export declare const onboardingPrExists: (config: RenovateConfig) => Promise<boolean>;
