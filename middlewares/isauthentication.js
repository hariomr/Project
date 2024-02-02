const listings = require("../models/listing.js");
const reviews = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");

module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        // console.log(req);
        req.flash("error", "You must have to be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.savedUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await listings.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You're not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await reviews.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You're not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
