import { Router } from "express"
import { userAuth } from "../middlewares/userAuth.js"
import { upload } from "../middlewares/multer.js"
import { CreateChannel, UpdateChannel } from "../controllers/channel.controller.js"

const channelRouter = Router()

channelRouter.post("/create", userAuth, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]), CreateChannel)

channelRouter.patch("/update", userAuth, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]), UpdateChannel)

export default channelRouter