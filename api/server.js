import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

app.use("/", (req, res) => {
    res.send(req.method);
});
