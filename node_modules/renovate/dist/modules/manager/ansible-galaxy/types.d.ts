import type { PackageDependency } from '../types';
export declare type AnsibleGalaxyPackageDependency = Omit<PackageDependency, 'managerData'> & Required<Pick<PackageDependency, 'managerData'>>;
