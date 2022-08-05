import type { UpdateDependencyConfig } from '../types';
import type { BazelManagerData } from './types';
export declare function updateDependency({ fileContent, upgrade, }: UpdateDependencyConfig<BazelManagerData>): Promise<string | null>;
