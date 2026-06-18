import { MockAgentApi } from "./agent-api";

export const agentApi = new MockAgentApi();

export const sendMessage = agentApi.sendMessage.bind(agentApi);
