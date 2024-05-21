// ./routes/user.js
import express from "express";
const router = express.Router();
import { getAllUsers, getUserById, createNewUser, updateUser} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.get("/", getAllUsers);
// router.get("/:id", getUserById);
router.post("/create", createNewUser);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);
// router.route("/login").post(loginUser);


export default router;
