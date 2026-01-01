import { uploadOnCloudnary } from "../config/cloudnary.js";
import { Channel } from "../models/channel.model.js";
import { Video } from "../models/video.model.js";



export const createVideo = async (req, res) => {
  try {
    const { channel, title, description, tags } = req.body

    if ([channel, title, description, tags].some(field => !field || field.trim())) {
      return res.status(400).send({ success: false, message: `channel, title, description and tags are requried` });
    }

    const channelData = await Channel.findById({ channelid })

    if (!channelData) {
      return res.status(400).send({ success: false, message: `channel not found` });
    }

    const uploadvideo = req.files.video ? await uploadOnCloudnary(rew.files.video[0].path) : ""
    const uploadthumbnail = rew.files.thumbnail ? await uploadOnCloudnary(rew.files.thumbnail[0].path) : ""

    let parsedTag = []
    if (tags) {
      parsedTag = JSON.parse(tage)
    }

    const newvideo = await Video.create({
      channel: channelData._id,
      title,
      description,
      tags: parsedTag,
      videoUrl: uploadvideo,
      thumbnail: uploadthumbnail
    })

    await Channel.findByIdAndUpdate(channelData._id,
      { $push: { videos: newvideo._id } },
      {new:true}
    )

    return res.status(201).send({success:true,message:"Video Uploaded success fully"})

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};