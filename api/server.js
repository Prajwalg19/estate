import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./routes/userRoute.js";
import Auth from "./routes/authRoute.js";
import cors from "cors";
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
app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    console.log("Server Stared at port :", PORT);
});
app.use("/api/user", User);
app.use("/api/auth", Auth);

app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let msg = err.message || "Interval server error";
    res.status(statusCode).json({
        message: msg,
        statusCode,
        success: false,
    });
});
