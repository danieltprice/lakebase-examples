import { PGVectorStore } from 'llamaindex/storage/vectorStore/PGVectorStore'
import { getConnectionString } from './lakebase'

export async function getVectorStore() {
  const connectionString = await getConnectionString()
  return new PGVectorStore({
    dimensions: 512,
    connectionString,
  })
}
