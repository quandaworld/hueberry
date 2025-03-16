const User = require("../models/user");

// Handle GET request for login page
exports.getLogin = (req, res) => {
  res.render("auth/login", { error: req.flash('error') });
};

// Handle GET request for registration page
exports.getRegister = (req, res) => {
  res.render("auth/register", { error: req.flash('error') });
};

// Handle POST request for user registration
exports.postRegister = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("auth/register", {
        error: "That username is taken. Try another.",
        firstName,
        lastName
      });
    }

    // Create new user
    const user = new User({
      username,
      password,
      firstName,
      lastName
    });

    await user.save();

    // Login the user after registration
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("auth/register", {
      error: "Server error during registration",
      ...req.body
    });
  }
};

// Handle GET request for logout
exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/");
  });
};