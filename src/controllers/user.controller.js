import { User } from "../models/user.model.js";
import validator from "validator";
import { SendOtp } from "../utils/otpEmal.js";



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

    return res.cookie("token", token, options).status(200).send({ success: true, message: "User Login successfully", user })

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const googleAuth = async (req, res) => {
  try {

    const { name, email, profile } = req.body


    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({ name, email, profilePhoto: profile, password: "1234" })
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

export const forgotpass = async (req, res) => {
  try {

    const { email } = req.body

    console.log(email)

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).send({ success: false, message: "User not exist" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await SendOtp(email, otp);


    return res.status(200).send({ success: true, message: "OTP sent successfully," })

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const EnterOtp = async (req, res) => {
  try {

    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).send({ success: false, message: "User not exist" })
    }

    if (user.resetOtp !== otp) {
      return res.status(400).send({ success: false, message: "Invalid OTP" })
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).send({ success: false, message: "OTP expired" })
    }

    user.resetOtp = "";
    user.otpExpiry = null;
    user.isOtpVerified = true;
    await user.save();

    res.status(200).send({ success: true, message: "OTP verified successfully", user })

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const NewPassword = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).send({ success: false, message: "User not exist" })
    }

    if (!password) {
      return res.status(400).send({ success: false, message: "New password is required" });
    }

    if (user.isOtpVerified === false) {
      return res.status(400).send({ success: false, message: "OTP not verified" });
    }

    user.password = password;
    user.resetOtp = "";
    user.isOtpVerified = false;
    await user.save();

    res.status(200).send({ success: true, message: "Password updated successfully", user })
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