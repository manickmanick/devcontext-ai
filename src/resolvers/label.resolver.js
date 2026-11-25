import { RESOLVER_NAMES } from "../constants/resolver-names.js";
import { getIssueLabels } from "../services/label.service.js";

export const registerLabelResolver = (resolver) => {
  resolver.define(RESOLVER_NAMES.FETCH_LABELS, async (req) => {
    const issueKey = req.context.extension.issue.key;

    return await getIssueLabels(issueKey);
  });
};
