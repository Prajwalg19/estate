import express from "express";
import {
  createListing,
  getListing,
  getListings,
  deleteListing,
  updateListing,
  getOwnerName,
  search,
} from "../controllers/listingsController.js";
import verifyToken from "../utils/verifyToken.js";
const router = express.Router();
router.post("/createListing", createListing);
router.get("/getListings/:uid", verifyToken, getListings);
router.get("/getListing/:id", getListing);
router.delete("/deleteListing/:id", verifyToken, deleteListing);
router.post("/updateListing/:id", verifyToken, updateListing);
router.get("/getOwner/:id", verifyToken, getOwnerName);
router.get("/search", search);
export default router;
