import mongoose from "mongoose";

const Listing = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        furnished: {
            type: Boolean,
            required: true,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        discountedPrice: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        offer: {
            type: Boolean,
            required: true,
        },
        imgURL: {
            type: Array,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const listingModel = mongoose.model("Listing", Listing);

export default listingModel;
