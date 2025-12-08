import { User } from "../models/user.model.js";
import validator from "validator";



const isProd = process.env.NODE_ENV === "production";

const options = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  maxAge: 24 * 60 * 60 * 1000,
};


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if ([name, email, password].some(field => !field || field.trim() === "")) {
      return res.status(400).send({ success: false, message: "All field are required" })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({ success: false, message: "Invalid email format" })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).send({ success: false, message: "User already exist" })
    }


    const user = await User.create({ name, email, password })
    const token = user.generateJwt()

    res.cookie("token", token, options).status(201).send({ success: true, message: "User register successfully", user })

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if ([email, password].some(field => !field || field.trim() === "")) {
      return res.status(400).send({ success: false, message: "All field are required" })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({ success: false, message: "Invalid email format" })
    }

    const user = await User.findOne({ email })




    if (!user) {
      return res.status(400).send({ success: false, message: "User not exist" })
    }
    const iscorrectpas = await user.isPasswordCorrect(password);

    if (!iscorrectpas) {
      return res.status(400).send({ success: false, message: "Incorrect Password" });
    }
    const token = user.generateJwt()

    res.cookie("token", token, options).status(201).send({ success: true, message: "User register successfully", user })

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const googleAuth = async (req, res) => {
  try {

    const { name, email, profile } = req.body


    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({ name, email, profilePhoto: profile ,password:"1234" })
    } else {
      if (!user.profilePhoto && profile) {
        user.profilePhoto = profile
        await user.save()
      }
    }

    const token = user.generateJwt()

    res.cookie("token", token, options).status(201).send({ success: true, message: "User register successfully", user })

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};


export const me = async (req, res) => {
  try {

    const user = req.user

    res.status(200).send({ success: true, message: "User data", user })
  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};
export const logout = async (req, res) => {
  try {
    res.status(200).clearCookie("token").send({ success: true, message: "Logout Successful" })
  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};