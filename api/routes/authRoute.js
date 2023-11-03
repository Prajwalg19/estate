import express from "express";
import { Signin, Signup, Google } from "../controllers/authController.js";
const router = express.Router();

router.post("/signin", Signin);
router.post("/signup", Signup);
router.post("/OAuth", Google);

export default router;
