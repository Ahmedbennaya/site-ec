import express from "express";
import { registerUser, loginuser, logoutUser } from "../Controllers/userController.js";

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/login", loginuser);
router.post("/logout", logoutUser);

export default router;