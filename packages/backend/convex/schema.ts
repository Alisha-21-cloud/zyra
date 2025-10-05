import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    plugins: defineTable({
        organizationId: v.string(),
        service: v.union(v.literal("vapi")),
        secretName: v.string(),
    })
        .index("by_organization_id", ["organizationId"])
        .index("by_organization_id_and_service", ["organizationId", "service"])
    ,
    conversations: defineTable({
       threadId: v.string(),
       organizationId: v.string(),
       contactSessionId: v.id("contactSessions"),
       status: v.union(
        v.literal("unresolved"),
        v.literal("escalated"),
        v.literal("resolved"),
       ), 
    })
        .index("by_organization_id",["organizationId"])
        .index("by_contact_session_id",["contactSessionId"])
        .index("by_thread_id",["threadId"])
        .index("by_status_and_organization_id",["status","organizationId"]),
    contactSessions: defineTable({
        name: v.string(),
        email: v.string(),
        organizationId: v.string(),
        expiresAt: v.number(),
        metadata: v.optional(v.object({
            userAgent: v.optional(v.string()),
            language: v.optional(v.string()),
            languages: v.optional(v.string()),
            platform: v.optional(v.string()),
            vendor: v.optional(v.string()),
            screenResolution: v.optional(v.string()),
            viewportSize: v.optional(v.string()),
            timezone: v.optional(v.string()),
            timezoneOffset: v.optional(v.number()),
            cookieEnabled: v.optional(v.boolean()),
            referrer: v.optional(v.string()),
            currentUrl: v.optional(v.string()),
        })),
    })
    .index("by_organization_id",["organizationId"])
    .index("by_expires_at",["expiresAt"]),
    users: defineTable({
        name: v.string(),
    }),
});
