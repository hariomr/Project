const mongoose = require("mongoose");
const review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },

    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: "review"
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },

    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing.reviews.length) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})
const listing = mongoose.model("listing", listingSchema);
module.exports = listing;