const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");

router.get("/", ensureAuthenticated, dashboardController.getDashboard);

module.exports = router;
