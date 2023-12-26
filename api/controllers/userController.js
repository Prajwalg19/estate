import { userModel } from "../models/user.model.js";
import customError from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const deleteUser = async (req, res, next) => {
  const uid = req.params.uid;
  if (uid != req.myValue.id) {
    next(customError(403, "Forbidden"));
    return;
  }
  try {
    const query = await userModel.findByIdAndDelete({ _id: uid });
    if (query) {
      res
        .status(200)
        .clearCookie("my_cookie")
        .json({ message: "Account Deleted", success: true });
    } else {
      res.status(404).json({ message: "Account Not Found", success: false });
    }
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.params.uid != req.myValue.id) {
      next(
        customError(403, "Forbidden, can't change values of different account")
      );
      return;
    }
    if (req.body?.password) {
      req.body.password = bcryptjs.hashSync(req.body.password);
    }
    const query = await userModel.findOneAndUpdate(
      { _id: req.myValue.id },
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          photoURL: req.body.photoURL,
        },
      },
      { new: true } //returns the most recent updated document instead of the old document
    );
    const { password, ...rest } = query._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
