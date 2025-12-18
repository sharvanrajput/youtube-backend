import { Router } from "express"
import { EnterOtp, forgotpass, googleAuth, login, logout, me, NewPassword, signup } from "../controllers/user.controller.js"
import { userAuth } from "../middlewares/userAuth.js"
import { upload } from "../middlewares/multer.js"

const userRouter = Router()

userRouter.post("/register", signup)
userRouter.post("/login", login)
userRouter.post("/me", userAuth, me)
userRouter.post("/googleauth", googleAuth)
userRouter.post("/forgototppass", forgotpass)
userRouter.post("/enterotp", EnterOtp)
userRouter.post("/newpassword", NewPassword)
userRouter.post("/logout", logout)

export default userRouter