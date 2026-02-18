import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

let cachedClient: MongoClient | null = null
let cachedDb: any = null

function resolveDatabaseName(uri: string): string {
  if (MONGODB_DB?.trim()) {
    return MONGODB_DB.trim()
  }

  try {
    const parsed = new URL(uri)
    const dbFromUri = parsed.pathname.replace(/^\//, "")
    if (dbFromUri) {
      return decodeURIComponent(dbFromUri)
    }
  } catch {
    // Ignore URL parsing failures and use fallback.
  }

  return "image-search"
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(resolveDatabaseName(MONGODB_URI))

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}
