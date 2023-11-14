import express from "express";
import { createListing } from "../controllers/listingsController.js";
const router = express.Router();
router.post("/createListing", createListing);

export default router;
