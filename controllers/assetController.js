const Asset = require("../models/asset");
const { extractColors } = require("../utils/colorAnalysis");

// Display upload form
exports.getUploadForm = (req, res) => {
  res.render("assets/upload");
};

// Handle image upload
exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).render("assets/upload", {
        error: "Please select an image to upload",
      });
    }

    // Get the file URL from Cloudinary response
    const fileUrl = req.file.secure_url || req.file.path;

    // Extract colors from the uploaded image
    const colors = await extractColors(fileUrl);

    // Create new asset
    const asset = new Asset({
      fileName: req.body.title || req.file.originalname,
      fileUrl: fileUrl,
      publicId: req.file.public_id || req.file.filename, // Cloudinary public ID
      fileType: req.file.mimetype,
      createdBy: req.user._id,
      colors: colors,
      tags: req.body.tags
        ? req.body.tags.split(",").map((tag) => tag.trim())
        : [],
    });

    await asset.save();

    console.log("Flash success message:", "Asset uploaded successfully");
    req.flash("success", "Asset uploaded successfully");
    res.redirect("/assets/index");
  } catch (error) {
    console.error("Error uploading asset:", error);
    res.status(500).render("assets/upload", {
      error: errorMessage,
    });
  }
};

// Get all assets for current user
exports.getUserAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("assets/index", { assets });
  } catch (error) {
    console.error("Error getting assets:", error);
    req.flash("error", "Error retrieving your assets");
    res.redirect("/dashboard");
  }
};

// Get single asset details
exports.getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .exec();

    if (!asset) {
      req.flash("error", "Asset not found");
      return res.redirect("/assets");
    }

    res.render("assets/show", { asset });
  } catch (error) {
    console.error("Error getting asset details:", error);
    req.flash("error", "Error retrieving asset details");
    res.redirect("/assets");
  }
};
