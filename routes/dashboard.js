const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/auth");
const Project = require("../models/project");
const Asset = require("../models/asset");

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    // Get 3 most recently updated projects
    const recentProjects = await Project.find({ createdBy: req.user._id })
      .populate({
        path: 'assets',
        select: 'fileUrl', // Only populate the fileUrl for thumbnails
        options: { limit: 4 }
      })
      .sort({ updatedAt: -1 })
      .limit(3);
    
    // Get recent uploads
    const recentUploads = await Asset.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);
    
    // Get total counts for analytics
    const totalProjects = await Project.countDocuments({ createdBy: req.user._id });
    const totalAssets = await Asset.countDocuments({ createdBy: req.user._id });
    
    res.render("dashboard", {
      recentProjects,
      recentUploads,
      analytics: {
        totalProjects,
        totalAssets
      }
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.render("dashboard", { error: "Error loading dashboard data" });
  }
});

module.exports = router;
