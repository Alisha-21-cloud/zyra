import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";

export const getOneByConversationId = query({
    args: {
        conversationId: v.id("conversations")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found"
            })
        }

        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found"
            })
        }

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found"
            })
        }

        if (conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid Organization Id"
            })
        }

        const contactSession = await ctx.db.get(conversation.contactSessionId);

        return contactSession;
    }
})