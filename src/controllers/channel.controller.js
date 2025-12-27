import { uploadOnCloudnary } from "../config/cloudnary.js";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
export const CreateChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body
    const { id } = req.user

    if (!name || !description || !category) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      })
    }
    const existingChannel = await Channel.findOne({ owner: id })
    if (existingChannel) {
      return res.status(400).send({
        success: false,
        message: "User already has a channel",
      })
    }

    const findChannel = await Channel.findOne({ name })
    if (findChannel) {
      return res.status(400).send({
        success: false,
        message: "Channel name already taken",
      })
    }

    console.log("avatar img",req.files.avatar[0].path)
    console.log("banner img",req.files.banner[0].path)

    const avatarUploaded = req.files?.avatar
      ? await uploadOnCloudnary(req.files.avatar[0].path)
      : null

    const bannerUploaded = req.files?.banner
      ? await uploadOnCloudnary(req.files.banner[0].path)
      : null

  

    const newChannel = await Channel.create({
      name,
      description,
      category,
      avatar: avatarUploaded,
      banner: bannerUploaded,
      owner: id,
    })

    await User.findByIdAndUpdate(id, {
      channel: newChannel._id,
      name,
      profilePhoto: avatarUploaded,
    })

    return res.status(201).send({
      success: true,
      message: "Channel created successfully",
      newChannel,
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    })
  }
} 
