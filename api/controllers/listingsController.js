import listingModel from "../models/listings.model.js";
import customError from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    const newListing = new listingModel({ ...req.body });
    await newListing.save();
    res.status(201).json({ listingData: newListing, status: "success" });
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    if (req.myValue.id != req.params.uid) return customError(403, "Forbidden");
    const _id = req.myValue.id;
    const query = await listingModel.find({ userRef: _id });
    res.status(200).json(query);
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
        return customError(403, "You cannot delete this listing");
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
