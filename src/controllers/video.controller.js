import { uploadOnCloudnary } from "../config/cloudnary.js";
import { Channel } from "../models/channel.model.js";
import { Video } from "../models/video.model.js";


export const createVideo = async (req, res) => {
  try {
    const { channel, title, description, tags } = req.body

    // ✅ Correct validation
    if ([channel, title, description].some(field => !field || !field.trim())) {
      return res.status(400).json({
        success: false,
        message: "Channel, title and description are required",
      })
    }

    // ✅ Correct findById usage
    const channelData = await Channel.findById(channel)
    if (!channelData) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      })
    }

    // ✅ Safe file access
    let videoUrl = ""
    let thumbnailUrl = ""

    if (req.files?.video?.[0]) {
      const uploadedVideo = await uploadOnCloudnary(
        req.files.video[0].path
      )
      videoUrl = uploadedVideo
      
    }

    if (req.files?.thumbnail?.[0]) {
      const uploadedThumbnail = await uploadOnCloudnary(
        req.files.thumbnail[0].path
      )
      thumbnailUrl = uploadedThumbnail
    }

    // ✅ Safe tags parsing
    let parsedTags = []
    if (tags) {
      parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags)
    }

    // ✅ Create video
    const newVideo = await Video.create({
      channel: channelData._id,
      title,
      description,
      tags: parsedTags,
      videoUrl,
      thumbnail: thumbnailUrl,
    })

    // ✅ Push video into channel
    await Channel.findByIdAndUpdate(
      channelData._id,
      { $push: { videos: newVideo._id } }
    )

    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: newVideo,
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}
