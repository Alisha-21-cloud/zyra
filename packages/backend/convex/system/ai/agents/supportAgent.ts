import { components } from "../../../_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { google } from '@ai-sdk/google';

export const supportAgent = new Agent(components.agent,{
    chat: google.chat("gemini-1.5-flash"),
    instructions: `you are a customer support agent. Use "resolveConversation" tool when user express finalization of the conversation. Use "escalateConversation" tool when user expresses frustation , or request a human support or human explicitly`, 
})