import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import listingRouter from "./routes/listingsRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });
const PORT = process.env.PORT_NUMBER || 4500;
const corsOptions = {
  origin: "http://localhost:5173", // requests from this origin are allowed
  credentials: true, //permits cookie credentials to be allowed
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.listen(PORT, () => {
  console.log("Server Stared at port :", PORT);
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let msg = err.message || "Internal server error";
  res.status(statusCode).json({
    message: msg,
    statusCode,
    success: false,
  });
});
