const review = require("../models/review");
const listings = require("../models/listing");

module.exports.createReview = async (req, res) => {
    let listing = await listings.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroy = async (req, res) => {
    let { id, reviewId } = req.params;
    await listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully!!");
    res.redirect(`/listings/${id}`);
};