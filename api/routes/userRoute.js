import express from "express";
import { deleteUser, updateUser } from "../controllers/userController.js";
import verifyToken from "../utils/verifyToken.js";
const router = express.Router();

router.delete("/delete/:uid", verifyToken, deleteUser);
router.post("/update/:uid", verifyToken, updateUser);

export default router;
