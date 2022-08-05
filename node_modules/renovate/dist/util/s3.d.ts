import { S3 } from '@aws-sdk/client-s3';
export declare function getS3Client(): S3;
export interface S3UrlParts {
    Bucket: string;
    Key: string;
}
export declare function parseS3Url(rawUrl: URL | string): S3UrlParts | null;
