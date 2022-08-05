"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoDirectDatasource = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../../../logger");
const decorator_1 = require("../../../util/cache/package/decorator");
const regex_1 = require("../../../util/regex");
const bitbucket_tags_1 = require("../bitbucket-tags");
const datasource_1 = require("../datasource");
const github_tags_1 = require("../github-tags");
const gitlab_tags_1 = require("../gitlab-tags");
const base_1 = require("./base");
const common_1 = require("./common");
class GoDirectDatasource extends datasource_1.Datasource {
    constructor() {
        super(GoDirectDatasource.id);
        this.github = new github_tags_1.GithubTagsDatasource();
        this.gitlab = new gitlab_tags_1.GitlabTagsDatasource();
        this.bitbucket = new bitbucket_tags_1.BitBucketTagsDatasource();
    }
    /**
     * go.getReleases
     *
     * This datasource resolves a go module URL into its source repository
     *  and then fetch it if it is on GitHub.
     *
     * This function will:
     *  - Determine the source URL for the module
     *  - Call the respective getReleases in github/gitlab to retrieve the tags
     *  - Filter module tags according to the module path
     */
    async getReleases(config) {
        const { packageName } = config;
        let res = null;
        logger_1.logger.trace(`go.getReleases(${packageName})`);
        const source = await base_1.BaseGoDatasource.getDatasource(packageName);
        if (!source) {
            logger_1.logger.info({ packageName }, 'Unsupported go host - cannot look up versions');
            return null;
        }
        switch (source.datasource) {
            case github_tags_1.GithubTagsDatasource.id: {
                res = await this.github.getReleases(source);
                break;
            }
            case gitlab_tags_1.GitlabTagsDatasource.id: {
                res = await this.gitlab.getReleases(source);
                break;
            }
            case bitbucket_tags_1.BitBucketTagsDatasource.id: {
                res = await this.bitbucket.getReleases(source);
                break;
            }
            /* istanbul ignore next: can never happen, makes lint happy */
            default: {
                return null;
            }
        }
        // istanbul ignore if
        if (!res) {
            return null;
        }
        const sourceUrl = (0, common_1.getSourceUrl)(source);
        /**
         * github.com/org/mod/submodule should be tagged as submodule/va.b.c
         * and that tag should be used instead of just va.b.c, although for compatibility
         * the old behaviour stays the same.
         */
        const nameParts = packageName.replace((0, regex_1.regEx)(/\/v\d+$/), '').split('/');
        logger_1.logger.trace({ nameParts, releases: res.releases }, 'go.getReleases');
        // If it has more than 3 parts it's a submodule or subgroup (gitlab only)
        if (nameParts.length > 3) {
            const prefix = nameParts.slice(3, nameParts.length).join('/');
            logger_1.logger.trace(`go.getReleases.prefix:${prefix}`);
            // Filter the releases so that we only get the ones that are for this submodule
            // Also trim the submodule prefix from the version number
            const submodReleases = res.releases
                .filter((release) => release.version?.startsWith(prefix))
                .map((release) => {
                const r2 = release;
                r2.version = r2.version.replace(`${prefix}/`, '');
                return r2;
            });
            logger_1.logger.trace({ submodReleases }, 'go.getReleases');
            // If not from gitlab -> no subgroups -> must be submodule
            // If from gitlab and directory one level above has tags -> has to be submodule, since groups can't have tags
            // If not, it's simply a repo in a subfolder, and the normal tags are used.
            if (!(source.datasource === gitlab_tags_1.GitlabTagsDatasource.id) ||
                (source.datasource === gitlab_tags_1.GitlabTagsDatasource.id && submodReleases.length)) {
                return {
                    sourceUrl,
                    releases: submodReleases,
                };
            }
        }
        if (res.releases) {
            res.releases = res.releases.filter((release) => release.version?.startsWith('v'));
        }
        return { ...res, sourceUrl };
    }
}
GoDirectDatasource.id = 'go-direct';
tslib_1.__decorate([
    (0, decorator_1.cache)({
        namespace: `datasource-${GoDirectDatasource.id}`,
        key: ({ packageName }) => packageName,
    })
], GoDirectDatasource.prototype, "getReleases", null);
exports.GoDirectDatasource = GoDirectDatasource;
//# sourceMappingURL=releases-direct.js.map