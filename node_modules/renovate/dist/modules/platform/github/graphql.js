"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableAutoMergeMutation = exports.vulnerabilityAlertsQuery = exports.getIssuesQuery = exports.openPrsQuery = exports.closedPrsQuery = exports.repoInfoQuery = void 0;
exports.repoInfoQuery = `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    isFork
    isArchived
    nameWithOwner
    hasIssuesEnabled
    autoMergeAllowed
    mergeCommitAllowed
    rebaseMergeAllowed
    squashMergeAllowed
    defaultBranchRef {
      name
      target {
        oid
      }
    }
  }
}
`;
exports.closedPrsQuery = `
query($owner: String!, $name: String!, $count: Int, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequests(
      states: [CLOSED, MERGED],
      orderBy: {
        field: UPDATED_AT,
        direction: DESC
      },
      first: $count,
      after: $cursor
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        number
        state
        headRefName
        title
        comments(last: 100) {
          nodes {
            databaseId
            body
          }
        }
      }
    }
  }
}
`;
exports.openPrsQuery = `
query($owner: String!, $name: String!, $count: Int, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequests(
      states: [OPEN],
      orderBy: {
        field: UPDATED_AT,
        direction: DESC
      },
      first: $count,
      after: $cursor
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        number
        headRefName
        baseRefName
        title
        labels(last: 100) {
          nodes {
            name
          }
        }
        assignees {
          totalCount
        }
        reviewRequests {
          totalCount
        }
        body
      }
    }
  }
}
`;
exports.getIssuesQuery = `
query(
  $owner: String!,
  $name: String!,
  $user: String!,
  $count: Int,
  $cursor: String
) {
  repository(owner: $owner, name: $name) {
    issues(
      orderBy: { field: UPDATED_AT, direction: DESC },
      filterBy: { createdBy: $user },
      first: $count,
      after: $cursor
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        number
        state
        title
        body
      }
    }
  }
}
`;
const vulnerabilityAlertsQuery = (filterByState) => `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    vulnerabilityAlerts(last: 100, ${filterByState ? 'states: [OPEN]' : ''}) {
      edges {
        node {
          dismissReason
          vulnerableManifestFilename
          vulnerableManifestPath
          vulnerableRequirements
          securityAdvisory {
            description
            identifiers { type value }
            references { url }
            severity
          }
          securityVulnerability {
            package { name ecosystem }
            firstPatchedVersion { identifier }
            vulnerableVersionRange
          }
        }
      }
    }
  }
}
`;
exports.vulnerabilityAlertsQuery = vulnerabilityAlertsQuery;
exports.enableAutoMergeMutation = `
mutation EnablePullRequestAutoMerge(
  $pullRequestId: ID!,
  $mergeMethod: PullRequestMergeMethod!,
) {
  enablePullRequestAutoMerge(
    input: {
      pullRequestId: $pullRequestId,
      mergeMethod: $mergeMethod,
    }
  ) {
    pullRequest {
      number
    }
  }
}
`;
//# sourceMappingURL=graphql.js.map