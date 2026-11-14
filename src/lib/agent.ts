import { createAgent, registerTools } from "@ui-sdk/react/agent";
export const agent = createAgent();
registerTools(agent, { allow: (step) => !step.confirm });
