import type { RenovateConfig, RenovateSharedConfig } from '../../../../config/types';
declare function getOnboardingConfig(config: RenovateConfig): Promise<RenovateSharedConfig>;
declare function getOnboardingConfigContents(config: RenovateConfig, fileName: string): Promise<string>;
export { getOnboardingConfig, getOnboardingConfigContents };
