import type { ExtractConfig, PackageFile } from '../types';
export default function extractPackageFile(_content: string, fileName: string, config: ExtractConfig): Promise<PackageFile | null>;
