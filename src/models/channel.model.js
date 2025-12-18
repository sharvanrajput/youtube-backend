import mongoose from "mongoose"

const channelSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requiredL: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: true
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  }],
  shorts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Short",
  }],
  Playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
  }],
  communityPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],



}, { timestamps: true })

export const Channel = mongoose.model("Channel", channelSchema)