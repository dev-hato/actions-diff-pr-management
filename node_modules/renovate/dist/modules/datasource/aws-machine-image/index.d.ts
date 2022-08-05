import { Image } from '@aws-sdk/client-ec2';
import { Datasource } from '../datasource';
import type { GetReleasesConfig, ReleaseResult } from '../types';
export declare class AwsMachineImageDataSource extends Datasource {
    static readonly id = "aws-machine-image";
    readonly defaultVersioning = "aws-machine-image";
    readonly caching = true;
    readonly defaultConfig: {
        commitMessageExtra: string;
        prBodyColumns: string[];
        prBodyDefinitions: {
            Image: string;
        };
        digest: {
            commitMessageExtra: string;
            prBodyColumns: string[];
            prBodyDefinitions: {
                Image: string;
            };
        };
    };
    private readonly ec2;
    private readonly now;
    constructor();
    getSortedAwsMachineImages(serializedAmiFilter: string): Promise<Image[]>;
    getDigest({ packageName: serializedAmiFilter }: GetReleasesConfig, newValue?: string): Promise<string | null>;
    getReleases({ packageName: serializedAmiFilter, }: GetReleasesConfig): Promise<ReleaseResult | null>;
}
