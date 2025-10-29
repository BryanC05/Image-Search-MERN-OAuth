import type { ObjectId } from "mongodb"
import { getDatabase } from "./db"

export interface User {
  _id?: ObjectId
  email: string
  name: string
  oauthId: string
  oauthProvider: "google" | "facebook" | "github"
  createdAt: Date
}

export interface Search {
  _id?: ObjectId
  userId: ObjectId
  query: string
  imageCount: number
  selectedImages: string[]
  createdAt: Date
}

export interface TopSearch {
  _id?: ObjectId
  query: string
  count: number
  lastSearched: Date
}

export async function findOrCreateUser(
  email: string,
  name: string,
  oauthId: string,
  oauthProvider: "google" | "facebook" | "github",
): Promise<User> {
  const db = await getDatabase()
  const users = db.collection("users")

  let user = await users.findOne({ oauthId, oauthProvider })

  if (!user) {
    const result = await users.insertOne({
      email,
      name,
      oauthId,
      oauthProvider,
      createdAt: new Date(),
    })
    user = await users.findOne({ _id: result.insertedId })
  }

  return user
}

export async function saveSearch(
  userId: ObjectId,
  query: string,
  imageCount: number,
  selectedImages: string[],
): Promise<Search> {
  const db = await getDatabase()
  const searches = db.collection("searches")
  const topSearches = db.collection("topSearches")

  const result = await searches.insertOne({
    userId,
    query,
    imageCount,
    selectedImages,
    createdAt: new Date(),
  })

  // Update top searches
  await topSearches.updateOne(
    { query },
    {
      $inc: { count: 1 },
      $set: { lastSearched: new Date() },
    },
    { upsert: true },
  )

  return await searches.findOne({ _id: result.insertedId })
}

export async function getUserSearches(userId: ObjectId) {
  const db = await getDatabase()
  return await db.collection("searches").find({ userId }).sort({ createdAt: -1 }).toArray()
}

export async function getTopSearches(limit = 5) {
  const db = await getDatabase()
  return await db.collection("topSearches").find({}).sort({ count: -1 }).limit(limit).toArray()
}

export async function clearUserSearches(userId: ObjectId) {
  const db = await getDatabase()
  await db.collection("searches").deleteMany({ userId })
}
