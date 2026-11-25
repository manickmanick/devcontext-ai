import { findIssueLabels } from "../repositories/jira-issue.repository.js";

export const getIssueLabels = async (issueKey) => {
  const labels = await findIssueLabels(issueKey);

  return Array.isArray(labels) ? labels : [];
};
