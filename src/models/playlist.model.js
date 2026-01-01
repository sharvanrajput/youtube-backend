import mongoose from "mongoose"


const playlistSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    }],
  },
  { timestamps: true }
)

export const Playlist = mongoose.model("Playlist", playlistSchema)
