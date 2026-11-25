import { RESOLVER_NAMES } from "../constants/resolver-names.js";
import { getIssueDetails } from "../services/issue.service.js";

export const registerIssueResolver = (resolver) => {
  resolver.define(RESOLVER_NAMES.GET_ISSUE_DETAILS, async (req) => {
    const issueKey = req.context.extension.issue.key;

    return await getIssueDetails(issueKey);
  });
};
