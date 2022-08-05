"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseS3Url = exports.getS3Client = void 0;
// Singleton S3 instance initialized on-demand.
const client_s3_1 = require("@aws-sdk/client-s3");
const url_1 = require("./url");
let s3Instance;
function getS3Client() {
    if (!s3Instance) {
        s3Instance = new client_s3_1.S3({});
    }
    return s3Instance;
}
exports.getS3Client = getS3Client;
function parseS3Url(rawUrl) {
    const parsedUrl = typeof rawUrl === 'string' ? (0, url_1.parseUrl)(rawUrl) : rawUrl;
    if (parsedUrl === null) {
        return null;
    }
    if (parsedUrl.protocol !== 's3:') {
        return null;
    }
    return {
        Bucket: parsedUrl.host,
        Key: parsedUrl.pathname.substring(1),
    };
}
exports.parseS3Url = parseS3Url;
//# sourceMappingURL=s3.js.map