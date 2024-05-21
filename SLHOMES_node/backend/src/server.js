import express, { Router } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express()

// Enable CORS for a specific origin
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,  // Include if you're sending cookies or credentials
  }));
  
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.use("/api/users", userRouter)
app.use("/api", authRouter)



export { app }