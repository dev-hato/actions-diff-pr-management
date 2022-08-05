import type { PackageDependency, PackageFile } from '../types';
import type { HelmChart, Image, Kustomize } from './types';
export declare function extractResource(base: string): PackageDependency | null;
export declare function extractImage(image: Image): PackageDependency | null;
export declare function extractHelmChart(helmChart: HelmChart): PackageDependency | null;
export declare function parseKustomize(content: string): Kustomize | null;
export declare function extractPackageFile(content: string): PackageFile | null;
