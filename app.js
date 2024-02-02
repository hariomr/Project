require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbs_url = process.env.MONGO_ATLAS;
const listings = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const wrapAsync = require("./utils/Wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const Listings = require("./routes/lisitings.js");
const Reviews = require("./routes/reviews.js");
const singUp = require("./routes/signup.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const store = MongoStore.create({
    mongoUrl: dbs_url,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,

})

store.on("error", () => {
    console.log("error");
})
const secretCode = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


app.use(methodOverride("_method"));

main().then(() => {
    console.log("connected Successfully");
}).catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect(dbs_url);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(secretCode));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.signedup = req.flash("signedup-successful");
    res.locals.currUser = req.user;
    next();
})

const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(404, "Send valid data");
    } else {
        next();
    }
}

app.use("/listings", Listings);
app.use("/listings/:id/reviews", Reviews);
app.use("/", singUp);

// app.get("/demo", async (req, res) => {
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "DeltaStudent",
//     })
//     let registeredUser = await User.register(fakeuser, "123");
//     res.send(registeredUser);
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let { status = 500, message } = err;
    res.render("listings/error.ejs", { message });
})
app.listen(8080, () => {
    console.log("Listening on port 8080");
})
