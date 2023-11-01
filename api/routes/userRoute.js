import express from "express";
import { demo } from "../controllers/userController.js";
const router = express.Router();

router.get("/demo", demo);

export default router;
