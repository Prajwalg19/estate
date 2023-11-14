import listingModel from "../models/listings.model.js";
export const createListing = async (req, res, next) => {
    try {
        const newListing = await listingModel.create(req.body);
        res.status(201).send(newListing);
    } catch (error) {
        next(error);
    }
};
