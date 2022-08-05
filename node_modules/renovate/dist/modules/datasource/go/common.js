"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceUrl = exports.GoproxyFallback = void 0;
const bitbucket_tags_1 = require("../bitbucket-tags");
const common_1 = require("../github-releases/common");
const github_tags_1 = require("../github-tags");
const gitlab_tags_1 = require("../gitlab-tags");
const util_1 = require("../gitlab-tags/util");
// eslint-disable-next-line typescript-enum/no-enum
var GoproxyFallback;
(function (GoproxyFallback) {
    GoproxyFallback["WhenNotFoundOrGone"] = ",";
    GoproxyFallback["Always"] = "|";
})(GoproxyFallback = exports.GoproxyFallback || (exports.GoproxyFallback = {}));
function getSourceUrl(dataSource) {
    if (dataSource) {
        const { datasource, registryUrl, packageName } = dataSource;
        if (datasource === github_tags_1.GithubTagsDatasource.id) {
            return (0, common_1.getSourceUrl)(packageName, registryUrl);
        }
        if (datasource === gitlab_tags_1.GitlabTagsDatasource.id) {
            return (0, util_1.getSourceUrl)(packageName, registryUrl);
        }
        if (datasource === bitbucket_tags_1.BitBucketTagsDatasource.id) {
            return bitbucket_tags_1.BitBucketTagsDatasource.getSourceUrl(packageName, registryUrl);
        }
    }
    // istanbul ignore next
    return undefined;
}
exports.getSourceUrl = getSourceUrl;
//# sourceMappingURL=common.js.map