const express = require("express");
const router = express.Router();
const listings = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/Wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isAuthenticated } = require("../middlewares/isauthentication.js");
const { isOwner } = require("../middlewares/isauthentication.js");
const ListingController = require("../Controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(404, "Send valid data");
    } else {
        next();
    }
}

router.route("/")
    // index route
    .get(wrapAsync(ListingController.index))
    // create route
    .post(upload.single("listing[image]"), wrapAsync(ListingController.createlistings));

// router;

// Create route
router.get("/new", isAuthenticated, wrapAsync(ListingController.renderCreate));

// router
// show route 

router.get("/:id", wrapAsync(ListingController.show));

// edit route 
router.get("/:id/edit", isOwner, isAuthenticated, wrapAsync(ListingController.renderEdit));

// update
router.put("/:id", upload.single("listing[image]"), wrapAsync(ListingController.updateListings));


// delete route
router.delete("/:id/delete", isOwner, isAuthenticated, wrapAsync(ListingController.destroy));

module.exports = router;