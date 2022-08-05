export interface RepologyPackage {
    repo: string;
    visiblename: string;
    version: string;
    srcname?: string;
    binname?: string;
    origversion?: string;
}
export declare type RepologyPackageType = 'binname' | 'srcname';
