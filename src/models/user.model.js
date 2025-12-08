import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },

}, { timestamps: true })


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return null
  this.password = await bcrypt.hash(this.password, 10)
  return null
})


userSchema.methods.isPasswordCorrect = async function (password) {
  return  bcrypt.compare(password, this.password)
}

userSchema.methods.generateJwt = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECREAT, { expiresIn: "1d" })
}


export const User = mongoose.model("User", userSchema)