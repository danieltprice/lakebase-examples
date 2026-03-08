import { inngest } from "./client";
import { OpenAI } from "openai";
import { getSql } from "@/lib/lakebase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmbedding = inngest.createFunction(
  { id: "generate-document-embedding" },
  { event: "db/documents.inserted" },
  async ({ event, step }) => {
    const { id, title, content } = event.data.new;

    const embedding = await step.run("Generate embedding", async () => {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${title}\n\n${content}`,
        dimensions: 512,
      });
      return response.data[0].embedding;
    });

    await step.run("Store embedding", async () => {
      const sql = await getSql();
      await sql`
        UPDATE documents 
        SET 
          embedding = ${JSON.stringify(embedding)}::vector,
          processed_at = NOW()
        WHERE id = ${id}
      `;
    });

    return { id, status: "embedding_generated" };
  }
);
