const listings = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await listings.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderCreate = async (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.createlistings = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    // req.file store all the information related to the file uploaded 
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new listings(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    console.log(response.body.features[0].geometry);
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await listings.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    else {
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const listing = await listings.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListings = async (req, res) => {
    let { id } = req.params;
    let listing = await listings.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    await listings.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!!");
    res.redirect("/listings");
};