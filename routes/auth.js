const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/auth/login",
  failureFlash: true,
}));

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("auth/register", {
        error: "Username already exists",
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
});

router.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/");
  });
});

module.exports = router;
