module.exports.renderSingup = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.createUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        let registeredUser = await User.register(newUser, password);
        req.flash("success", "User-registered Successfully");
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            else {
                res.redirect("/listings");
            }
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderlogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash("success", "Logged in successfully");
    if (res.locals.savedUrl) {
        res.redirect(res.locals.savedUrl);
    } else {
        res.redirect("/listings");
    }
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/listings");
    })
};