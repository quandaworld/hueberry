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

    console.log("Asset uploaded successfully");
    res.redirect("/assets");
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
    res.redirect("/dashboard");
  }
};

// Get single asset details
exports.getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .exec();

    res.render("assets/show", { asset });
  } catch (error) {
    console.error("Error getting asset details:", error);
    req.flash('error', 'Asset not found');
    res.redirect("/assets");
  }
};

// Delete an asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    // Verify ownership (only allow users to delete their own assets)
    // TODO: Make sure this flash message shows
    if (asset.createdBy.toString() !== req.user._id.toString()) {
      req.flash('error', 'You do not have permission to delete this asset');
      return res.redirect('/assets/index');
    }
    
    // Delete image from Cloudinary
    if (asset.publicId) {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(asset.publicId);
    }
    
    // Delete the asset from the database
    await Asset.findByIdAndDelete(req.params.id);
    
    // Flash message and redirect
    req.flash('success', 'Asset deleted successfully');
    res.redirect('/assets');
  } catch (error) {
    console.error('Error deleting asset:', error);
    req.flash('error', 'Error deleting asset');
    res.redirect('/assets');
  }
};
