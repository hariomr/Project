const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/Wrapasync.js");
const passport = require("passport");
const Wrapasync = require("../utils/Wrapasync.js");
const { savedUrl } = require("../middlewares/isauthentication.js");
const userController = require("../Controller/user.js");

router.get("/signup", userController.renderSingup);

router.post("/signup", wrapAsync(userController.createUser));

// login
router.get("/login", savedUrl, userController.renderlogin);

router.post("/login", savedUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

// logout

router.get("/logout", userController.logout);

module.exports = router;