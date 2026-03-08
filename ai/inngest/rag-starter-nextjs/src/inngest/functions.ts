import { inngest } from "./client";
import { OpenAI } from "openai";
import { getSql } from "@/lib/lakebase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const processDocument = inngest.createFunction(
  { id: "process-document" },
  { event: "document/process" },
  async ({ event, step }) => {
    const { title, content } = event.data;

    const embedding = await step.run("Generate embedding", async () => {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${title}\n\n${content}`,
      });
      return response.data[0].embedding;
    });

    await step.run("Store document", async () => {
      const sql = await getSql();
      await sql`
        INSERT INTO documents (title, content, embedding)
        VALUES (${title}, ${content}, ${JSON.stringify(embedding)}::vector)
      `;
    });

    return { success: true };
  }
);
