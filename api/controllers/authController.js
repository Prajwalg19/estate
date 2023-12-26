import bcrypt from "bcryptjs";
import { userModel } from "../models/user.model.js";
import customError from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const Signup = async (req, res, next) => {
  try {
    let { userName, email, password } = req.body;
    password = bcrypt.hashSync(password);
    let newUser = new userModel({ userName, email, password });
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (e) {
    next(e);
  }
};

export const Signin = async (req, res, next) => {
  const { email, password } = req.body;
  let query = await userModel.findOne({ email });
  try {
    if (!query) {
      next(customError(404, "User not found"));
      return;
    }
    let decryptPass = await bcrypt.compare(password, query.password);
    if (decryptPass) {
      const token = jwt.sign({ id: query._id }, process.env.JWT_SEC_KEY);
      const { password, ...rest } = query._doc;
      res
        .cookie("my_cookie", token, { httpOnly: true })
        .status(200)
        .json({ user: rest, message: "LogIn successfull", success: true });
    } else {
      next(customError(401, "Wrong Credentials"));
    }
  } catch (e) {
    next(e);
  }
};

export const Google = async (req, res, next) => {
  const { userName, photoURL, email } = req.body;
  const query = await userModel.findOne({ email });
  try {
    if (!query) {
      let password = Math.random().toString(36).slice(-9);
      password = bcrypt.hashSync(password);
      let newUser = new userModel({
        password,
        userName:
          userName.split(" ").join("") +
          "_" +
          Math.random().toString().slice(-3),
        photoURL,
        email,
      });
      let user = await newUser.save();
      const { password: pass, ...rest } = user._doc;
      const token = jwt.sign({ id: rest._id }, process.env.JWT_SEC_KEY);
      res
        .cookie("my_cookie", token, { httpOnly: true })
        .status(200)
        .json({ success: true, user: rest, message: "Signed In" });
    }
    if (query) {
      const { password, ...rest } = query._doc;
      const token = jwt.sign({ id: query._id }, process.env.JWT_SEC_KEY);
      res
        .cookie("my_cookie", token, { httpOnly: true })
        .status(200)
        .json({ user: rest, message: "Logged In", success: true });
    }
  } catch (error) {
    next(error);
  }
};
