import mongoose from "mongoose"

const searchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  results: [
    {
      id: String,
      url: String,
      description: String,
      likes: Number,
      downloads: Number,
    },
  ],
  selectedImages: [String], // Array of image IDs
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Search", searchSchema)
