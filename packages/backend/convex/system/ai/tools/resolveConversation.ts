import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const resolveConversation = createTool({
    description: "Resolve a conversation",
    args: z.object({}),
    handler: async (ctx, args) => {
        if(!ctx.threadId) {
            return "Missing thread ID";
        }

        await ctx.runMutation(internal.system.conversations.resolve, {
            threadId: ctx.threadId
        });

        await supportAgent.saveMessage(ctx, {
            threadId: ctx.threadId,
            message:{
                role: "assistant",
                content: "Conversation resolved."
            }
        });

        return "Conversation resolved";
    },
});