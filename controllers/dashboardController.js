const Project = require("../models/project");
const Asset = require("../models/asset");

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    // Find 3 most recent projects where user is the creator
    const recentProjects = await Project.find({ createdBy: req.user._id })
      .populate({
        path: 'assets',
        select: 'fileUrl', // Only populate the fileUrl for thumbnails
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
};
