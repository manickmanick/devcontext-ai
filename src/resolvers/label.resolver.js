import { RESOLVER_NAMES } from "../constants/resolver-names.js";
import { getIssueLabels } from "../services/label.service.js";
import { successResponse, errorResponse } from "../utils/api-response.js";

export const registerLabelResolver = (resolver) => {
  resolver.define(RESOLVER_NAMES.FETCH_LABELS, async (req) => {
    try {
      console.log("[fetchLabels] Started");
      const issueKey = req.context.extension.issue.key;

      const labels = await getIssueLabels(issueKey);

      console.log("[fetchLabels] Completed");

      return successResponse(labels);
    } catch (error) {
      console.error("[fetchLabels] Failed:", error);

      return errorResponse(
        "LABEL_FETCH_FAILED",
        "Unable to fetch Jira issue labels",
      );
    }
  });
};
