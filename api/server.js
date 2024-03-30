import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import listingRouter from "./routes/listingsRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
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
app.listen(PORT, () => {
    console.log("Server Stared at port :", PORT);
});
const corsOpts = {
    origin: ["https://estate-lake.vercel.app", "http://localhost:5173"],
    credentials: true,
};
app.use(cors(corsOpts));

app.use(express.json());
app.use(cookieParser());
const __dirname = path.resolve();
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let msg = err.message || "Internal server error";
    res.status(statusCode).json({
        message: msg,
        statusCode,
        success: false,
    });
});
