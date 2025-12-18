import { uploadOnCloudnary } from "../config/cloudnary.js";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";

export const CreateChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body
    const { id } = req.user
    const existingChannel = await Channel.findOne({ owner: id })
    if (existingChannel) {
      return res.status(400).send({ success: false, message: `User already have a channel` });
    }
    const findChannel = await Channel.findOne({ name })
    if (findChannel) {
      return res.status(400).send({ success: false, message: `Channel name already taken. Try Another one` });
    }
    let avatar
    let banner
    if (req.files?.avatar) {
      avatar = uploadOnCloudnary(req.files.avatar[0].path)
    }
    if (req.files?.banner) {
      banner = uploadOnCloudnary(req.files.banner[0].path)
    }

    const newChannel = await Channel.create({
      name,
      description,
      category,
      avatar,
      banner,
      owner
    })

    await User.findByIdAndUpdate(id, {
      channel: newChannel._id,
      name,
      profilePhoto: avatar
    })

    return res.status(201).send({success:true,message:"Channel created successfully", newChannel})

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};