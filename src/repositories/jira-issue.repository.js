import api, { route } from "@forge/api";

export const findIssueByKey = async (issueKey) => {
  const response = await api
    .asUser()
    .requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description`,
    );

  if (!response.ok) {
    throw new Error(`Failed to fetch issue: ${response.status}`);
  }

  return await response.json();
};

export const findIssueLabels = async (issueKey) => {
  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueKey}?fields=labels`);

  if (!response.ok) {
    throw new Error(`Failed to fetch labels: ${response.status}`);
  }

  const data = await response.json();

  return data.fields.labels;
};
