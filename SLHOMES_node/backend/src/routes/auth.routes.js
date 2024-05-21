// ./routes/user.js
import express from "express";
const router = express.Router();
import {loginUser, logoutUser, refreshAccessToken} from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


router.post("/login", loginUser)

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

export default router;
