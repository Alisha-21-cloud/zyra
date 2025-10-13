import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { getSecretValue, parseSecretString } from "../lib/secrets";

export const getVapiSecrets = action({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const plugin = await ctx.runQuery(
            internal.system.plugins.getByOrganizationIdAndService,
            {
                organizationId: args.organizationId,
                service: "vapi",
            },
        );

        if (!plugin) {
            return null;
        }

        const secretName = plugin.secretName;

        const secret = await getSecretValue(secretName);

        const secretData = parseSecretString<{
            privateApiKey: string;
            publicApiKey: string;
        }>(secret);

        if (!secretData) {
            return null;
        }

        if(!secretData.publicApiKey) {
            return null;
        }

        if(!secretData.privateApiKey) {
            return null;
        }

        return {
            publicApiKey: secretData.publicApiKey,
        };
    },
});