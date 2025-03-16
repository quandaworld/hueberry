const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

// Login routes
router.get("/login", authController.getLogin);
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/auth/login",
  failureFlash: true,
}));

// Registration routes
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

// Logout route
router.get("/logout", authController.logout);

module.exports = router;
