import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();

resolver.define("fetchLabels", async (req) => {
  const key = req.context.extension.issue.key;

  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${key}?fields=labels`);

  if (!response.ok) {
    throw new Error(`Jira API error: ${response.status}`);
  }

  const data = await response.json();

  const labels = data.fields.labels;

  if (!Array.isArray(labels)) {
    return [];
  }

  return labels;
});

export const handler = resolver.getDefinitions();
