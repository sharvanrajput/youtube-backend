import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import { connectDb } from "./src/config/db.js"
import userRouter from "./src/routes/user.route.js"
dotenv.config()
const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    // origin: "http://localhost:5174",
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/v1/user", userRouter)


connectDb().then(() => {
  app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
  })
})