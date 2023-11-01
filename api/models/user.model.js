import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: { type: String, reqiured: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export const userModel = mongoose.model("modelForUser", userSchema);
