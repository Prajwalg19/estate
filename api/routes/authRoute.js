import express from "express";
import { Signin, Signup } from "../controllers/authController.js";
const router = express.Router();

router.get("/signin", Signin);
router.post("/signup", Signup);

export default router;