import { google } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

const rag = new RAG(components.rag, {
    textEmbeddingModel: google.textEmbeddingModel("text-embedding-004"),
    embeddingDimension: 768, // changed from 1536 to 768 according to documentation
})

export default rag;