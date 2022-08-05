"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsMachineImageDataSource = void 0;
const tslib_1 = require("tslib");
const client_ec2_1 = require("@aws-sdk/client-ec2");
const decorator_1 = require("../../../util/cache/package/decorator");
const lazy_1 = require("../../../util/lazy");
const amazonMachineImageVersioning = tslib_1.__importStar(require("../../versioning/aws-machine-image"));
const datasource_1 = require("../datasource");
class AwsMachineImageDataSource extends datasource_1.Datasource {
    constructor() {
        super(AwsMachineImageDataSource.id);
        this.defaultVersioning = amazonMachineImageVersioning.id;
        this.caching = true;
        this.defaultConfig = {
            // Because AMIs don't follow any versioning scheme, we override commitMessageExtra to remove the 'v'
            commitMessageExtra: 'to {{{newVersion}}}',
            prBodyColumns: ['Change', 'Image'],
            prBodyDefinitions: {
                Image: '```{{{newDigest}}}```',
            },
            digest: {
                // Because newDigestShort will allways be 'amazon-' we override to print the name of the AMI
                commitMessageExtra: 'to {{{newDigest}}}',
                prBodyColumns: ['Image'],
                prBodyDefinitions: {
                    Image: '```{{{newDigest}}}```',
                },
            },
        };
        this.ec2 = new lazy_1.Lazy(() => new client_ec2_1.EC2Client({}));
        this.now = Date.now();
    }
    async getSortedAwsMachineImages(serializedAmiFilter) {
        const cmd = new client_ec2_1.DescribeImagesCommand({
            Filters: JSON.parse(serializedAmiFilter),
        });
        const matchingImages = await this.ec2.getValue().send(cmd);
        matchingImages.Images = matchingImages.Images ?? [];
        return matchingImages.Images.sort((image1, image2) => {
            const ts1 = image1.CreationDate
                ? Date.parse(image1.CreationDate)
                : /* istanbul ignore next */ 0;
            const ts2 = image2.CreationDate
                ? Date.parse(image2.CreationDate)
                : /* istanbul ignore next */ 0;
            return ts1 - ts2;
        });
    }
    async getDigest({ packageName: serializedAmiFilter }, newValue) {
        const images = await this.getSortedAwsMachineImages(serializedAmiFilter);
        if (images.length < 1) {
            return null;
        }
        if (newValue) {
            const newValueMatchingImages = images.filter((image) => image.ImageId === newValue);
            if (newValueMatchingImages.length === 1) {
                return (newValueMatchingImages[0].Name ?? /* istanbul ignore next */ null);
            }
            return null;
        }
        const res = await this.getReleases({ packageName: serializedAmiFilter });
        return res?.releases?.[0]?.newDigest ?? /* istanbul ignore next */ null;
    }
    async getReleases({ packageName: serializedAmiFilter, }) {
        const images = await this.getSortedAwsMachineImages(serializedAmiFilter);
        const latestImage = images[images.length - 1];
        if (!latestImage?.ImageId) {
            return null;
        }
        return {
            releases: [
                {
                    version: latestImage.ImageId,
                    releaseTimestamp: latestImage.CreationDate,
                    isDeprecated: Date.parse(latestImage.DeprecationTime ?? this.now.toString()) <
                        this.now,
                    newDigest: latestImage.Name,
                },
            ],
        };
    }
}
AwsMachineImageDataSource.id = 'aws-machine-image';
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: `datasource-${AwsMachineImageDataSource.id}`,
        key: (serializedAmiFilter) => `getSortedAwsMachineImages:${serializedAmiFilter}`,
    })
], AwsMachineImageDataSource.prototype, "getSortedAwsMachineImages", null);
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: `datasource-${AwsMachineImageDataSource.id}`,
        key: ({ packageName }, newValue) => `getDigest:${packageName}:${newValue ?? ''}`,
    })
], AwsMachineImageDataSource.prototype, "getDigest", null);
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: `datasource-${AwsMachineImageDataSource.id}`,
        key: ({ packageName }) => `getReleases:${packageName}`,
    })
], AwsMachineImageDataSource.prototype, "getReleases", null);
exports.AwsMachineImageDataSource = AwsMachineImageDataSource;
//# sourceMappingURL=index.js.map