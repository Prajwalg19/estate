import listingModel from "../models/listings.model.js";
import customError from "../utils/error.js";
import { userModel } from "../models/user.model.js";
export const createListing = async (req, res, next) => {
  try {
    const newListing = new listingModel({ ...req.body });
    await newListing.save();
    res.status(201).json({ listingData: newListing, status: "success" });
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    if (req.myValue.id != req.params.uid) return customError(403, "Forbidden");
    const _id = req.myValue.id;
    const query = await listingModel.find({ userRef: _id });
    res.status(200).json(query);
  } catch (e) {
    next(e);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listingID = req.params.id;
    const query = await listingModel.findById(listingID);
    if (query) {
      res.status(200).json(query);
    } else {
      res.status(404);
    }
  } catch (e) {
    next(e);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listingID = req.params.id;
    const data = req.body;
    const query = await listingModel.findOne({ _id: listingID });
    if (req.myValue.id == query.userRef) {
      const query2 = await listingModel.findOneAndUpdate(query, data);
      res
        .status(200)
        .json({ status: "success", message: "Updation Successful", query2 });
    } else {
      next(customError(403, "Forbidden"));
    }
  } catch (e) {
    next(e);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listingID = req.params.id;
    const query = await listingModel.findOne({ _id: listingID });
    if (query) {
      if (query.userRef != req.myValue.id)
        return next(customError(403, "You cannot delete this listing"));
      const query2 = await listingModel.findByIdAndDelete(listingID);
      if (query2)
        res.status(200).json({ status: "success", message: "Listing deleted" });
      else next(customError(500, "Something Went Wrong"));
    } else {
      next(customError(404, "Listing Not found"));
    }
  } catch (error) {
    next(error);
  }
};

export async function getOwnerName(req, res, next) {
  const userID = req.params.id;
  try {
    const query = await userModel.findById(userID);
    if (query) {
      res.status(200).json({ userName: query.userName, email: query.email });
    } else {
      next(customError(404, "User not found"));
    }
  } catch (e) {
    next(e);
  }
}

export async function search(req, res, next) {
  try {
    let searchTerm = req.query.searchTerm || "";
    let offer = req.query.offer;
    let startIndex = req.query.startIndex || 0;
    let limit = req.query.limit || 3;
    let type = req.query.type;
    let parking = req.query.parking;
    let furnished = req.query.furnished;
    let sortWrt = req.query.sort || "createdAt";
    let order = req.query.order || "descending";

    if (offer == undefined || offer == "false")
      offer = { $in: ["true", "false"] };

    if (furnished == undefined || furnished == "false")
      furnished = { $in: ["true", "false"] };

    if (type == undefined || type == "all") type = { $in: ["rent", "sale"] };
    if (parking == undefined || parking == "false")
      parking = { $in: ["true", "false"] };

    let ans = await listingModel
      .find({
        $or: [
          {
            name: { $regex: searchTerm, $options: "i" }, //ignorecase
          },
          {
            description: { $regex: searchTerm, $options: "i" },
          },
        ],
        offer: offer, // i am writing this like this only for understandability, tle offer that is prepared based on the user selection or default in the previous steps is used here
        // where offer key specifies the mongoose to select documents with offer key have the offer value of the prepared offer variable
        parking: parking,
        type: type,
        furnished: furnished,
      })
      .sort({ [sortWrt]: order })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(ans);
  } catch (e) {
    next(e);
  }
}
