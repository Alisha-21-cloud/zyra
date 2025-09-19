import { defineApp } from "convex/server";
import rag from "@convex-dev/rag/convex.config";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();
app.use(agent);
app.use(rag);

export default app;