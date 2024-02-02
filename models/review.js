const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    Comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model("review", reviewSchema);