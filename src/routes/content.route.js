import { Router } from "express"
import { createVideo } from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.js"
import { userAuth } from "../middlewares/userAuth.js"

const contentRoute = Router()

contentRoute.post("/upload-create", userAuth, upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), createVideo)

 

export default contentRoute