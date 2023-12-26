import express from "express";
import {
  createListing,
  getListing,
  deleteListing,
} from "../controllers/listingsController.js";
import verifyToken from "../utils/verifyToken.js";
const router = express.Router();
router.post("/createListing", createListing);
router.get("/getListings/:uid", verifyToken, getListing);
router.delete("/deleteListing/:id", verifyToken, deleteListing);

export default router;
