import { findIssueByKey } from "../repositories/jira-issue.repository.js";
import { parseAdfToText } from "../utils/adf-parser.js";

export const getIssueDetails = async (issueKey) => {
  const issue = await findIssueByKey(issueKey);

  return {
    key: issue.key,
    summary: issue.fields.summary,
    description: parseAdfToText(issue.fields.description),
  };
};
