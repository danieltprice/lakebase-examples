import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { getSql } from "@/lib/lakebase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const sql = await getSql();

    // Generate embedding for the search query
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    const embedding = response.data[0].embedding;

    // Search for similar documents
    const results = await sql`
      SELECT 
        id,
        title,
        content,
        1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
      FROM documents
      WHERE embedding IS NOT NULL
      ORDER BY similarity DESC
      LIMIT 5
    `;

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching documents:", error);
    return NextResponse.json(
      { error: "Failed to search documents" },
      { status: 500 }
    );
  }
}
