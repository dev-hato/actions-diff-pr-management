export declare const NUGET_CENTRAL_FILE = "Directory.Packages.props";
export declare const MSBUILD_CENTRAL_FILE = "Packages.props";
/**
 * Get all package files at any level of ancestry that depend on packageFileName
 */
export declare function getDependentPackageFiles(packageFileName: string, isCentralManament?: boolean): Promise<string[]>;
