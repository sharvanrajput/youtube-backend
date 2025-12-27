import { Router } from "express"
import { userAuth } from "../middlewares/userAuth.js"
import { upload } from "../middlewares/multer.js"
import { CreateChannel } from "../controllers/channel.controller.js"

const channelRouter = Router()

channelRouter.post("/create", userAuth, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]), CreateChannel)


export default channelRouter