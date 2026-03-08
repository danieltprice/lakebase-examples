import { OpenAIEmbedding } from '@llamaindex/openai'
import { PGVectorStore } from 'llamaindex/storage/vectorStore/PGVectorStore'
import { Settings } from 'llamaindex'
import { getConnectionString } from './lakebase'

Settings.embedModel = new OpenAIEmbedding({
  dimensions: 512,
  model: 'text-embedding-3-small',
})

export async function getVectorStore() {
  const connectionString = await getConnectionString()
  return new PGVectorStore({
    dimensions: 512,
    connectionString,
  })
}
