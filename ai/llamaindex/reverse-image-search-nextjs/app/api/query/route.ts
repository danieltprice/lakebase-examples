export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { getVectorStore } from '@/lib/vectorStore'
import { ClipEmbedding } from 'llamaindex/embeddings/ClipEmbedding'
import { VectorStoreQueryMode } from 'llamaindex/storage/vectorStore/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file = data.get('file') as File
  if (!file) return new Response(null, { status: 400 })
  const fileBuffer = await file.arrayBuffer()
  const fileBlob = new Blob([fileBuffer], { type: file.type })
  const image_embedding = await new ClipEmbedding().getImageEmbedding(fileBlob)
  const vectorStore = await getVectorStore()
  const { similarities, nodes } = await vectorStore.query({
    similarityTopK: 100,
    queryEmbedding: image_embedding,
    mode: VectorStoreQueryMode.DEFAULT,
  })
  // Initialize an array to store relevant image URLs
  const relevantImages: string[] = []
  if (nodes) {
    similarities.forEach((similarity: number, index: number) => {
      // Check if similarity is greater than 90% (i.e., similarity threshold)
      if (100 - similarity > 90) {
        const document = nodes[index]
        relevantImages.push(document.metadata.url)
      }
    })
  }
  return NextResponse.json(relevantImages)
}
