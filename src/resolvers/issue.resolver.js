import { RESOLVER_NAMES } from "../constants/resolver-names.js";
import { getIssueDetails } from "../services/issue.service.js";
import { successResponse, errorResponse } from "../utils/api-response.js";

export const registerIssueResolver = (resolver) => {
  resolver.define(RESOLVER_NAMES.GET_ISSUE_DETAILS, async (req) => {
    try {
      console.log("[getIssueDetails] Started");
      const issueKey = req.context.extension.issue.key;

      const issue = await getIssueDetails(issueKey);

      console.log("[getIssueDetails] Completed");
      return successResponse(issue);
    } catch (error) {
      console.error("[getIssueDetails] Failed:", error);

      return errorResponse(
        "ISSUE_FETCH_FAILED",
        "Unable to fetch Jira issue details",
      );
    }
  });
};
