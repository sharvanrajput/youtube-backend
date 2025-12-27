import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadOnCloudnary = async (localFilePath) => {
  try {
    if (!localFilePath) return null

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })

    fs.unlinkSync(localFilePath)

    return res.secure_url

  } catch (error) {
    console.error("Cloudinary upload error:", error.message)

    fs.unlinkSync(localFilePath)

    return "cloudnary error"
    
  }
}
