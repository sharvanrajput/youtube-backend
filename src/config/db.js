import mongoose from "mongoose"

export const connectDb = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_RUL)
  } catch (error) {
    console.log("db not connected" + error.message)
  }
}; 