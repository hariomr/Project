const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/Wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const listings = require("../models/listing.js");
const { isAuthenticated, isAuthor } = require("../middlewares/isauthentication.js");

const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(404, "Send valid data");
    } else {
        next();
    }
}

const reviewController = require("../Controller/reviews.js");
//post review route 
router.post("/", isAuthenticated, validatereview, wrapAsync(reviewController.createReview));

// delete review route

router.delete("/:reviewId", isAuthenticated, isAuthor, wrapAsync(reviewController.destroy));

module.exports = router;