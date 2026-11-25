import Resolver from "@forge/resolver";

import { registerIssueResolver } from "./resolvers/issue.resolver.js";
import { registerLabelResolver } from "./resolvers/label.resolver.js";

const resolver = new Resolver();

registerIssueResolver(resolver);
registerLabelResolver(resolver);

export const handler = resolver.getDefinitions();
