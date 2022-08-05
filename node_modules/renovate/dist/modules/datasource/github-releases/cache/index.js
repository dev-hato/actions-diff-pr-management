"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheableGithubReleases = exports.query = void 0;
const cache_base_1 = require("./cache-base");
exports.query = `
query ($owner: String!, $name: String!, $cursor: String, $count: Int!) {
  repository(owner: $owner, name: $name) {
    payload: releases(
      first: $count
      after: $cursor
      orderBy: {field: CREATED_AT, direction: DESC}
    ) {
      nodes {
        version: tagName
        releaseTimestamp: publishedAt
        isDraft
        isPrerelease
        url
        id: databaseId
        name
        description
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`;
class CacheableGithubReleases extends cache_base_1.AbstractGithubDatasourceCache {
    constructor(http, opts = {}) {
        super(http, opts);
        this.cacheNs = 'github-datasource-graphql-releases';
        this.graphqlQuery = exports.query;
    }
    coerceFetched(item) {
        const { version, releaseTimestamp, isDraft, isPrerelease, url, id, name, description, } = item;
        if (isDraft) {
            return null;
        }
        const result = {
            version,
            releaseTimestamp,
            url,
            id,
            name,
            description,
        };
        if (isPrerelease) {
            result.isStable = false;
        }
        return result;
    }
}
exports.CacheableGithubReleases = CacheableGithubReleases;
//# sourceMappingURL=index.js.map