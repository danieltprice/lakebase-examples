import { NeonPostgres } from '@langchain/community/vectorstores/neon'
import { OpenAIEmbeddings } from '@langchain/openai'
import { getConnectionString } from './lakebase'

const embeddings = new OpenAIEmbeddings({
  dimensions: 512,
  model: "text-embedding-3-small"
})

export default async function loadVectorStore() {
  const connectionString = await getConnectionString()
  return await NeonPostgres.initialize(embeddings, { connectionString })
}
