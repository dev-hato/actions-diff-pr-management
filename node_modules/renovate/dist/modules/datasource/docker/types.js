"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaType = void 0;
// FIXME #12556
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Media Types
 * https://docs.docker.com/registry/spec/manifest-v2-2/#media-types
 * https://github.com/opencontainers/image-spec/blob/main/media-types.md
 */
// eslint-disable-next-line typescript-enum/no-enum
var MediaType;
(function (MediaType) {
    MediaType["manifestV1"] = "application/vnd.docker.distribution.manifest.v1+json";
    MediaType["manifestV2"] = "application/vnd.docker.distribution.manifest.v2+json";
    MediaType["manifestListV2"] = "application/vnd.docker.distribution.manifest.list.v2+json";
    MediaType["ociManifestV1"] = "application/vnd.oci.image.manifest.v1+json";
    MediaType["ociManifestIndexV1"] = "application/vnd.oci.image.index.v1+json";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
//# sourceMappingURL=types.js.map