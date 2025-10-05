import { components } from "../../../_generated/api";
import { Agent } from "@convex-dev/agent";
import { google } from '@ai-sdk/google';
import { SUPPORT_AGENT_PROMPT } from "../constants";

export const supportAgent = new Agent(components.agent,{
    chat: google.chat("gemini-2.5-flash"),
    instructions: SUPPORT_AGENT_PROMPT, 
})