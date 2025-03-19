const Asset = require("../models/asset");
const Project = require("../models/project");
const { extractColors } = require("../utils/colorAnalysis");
const { verifyOwnership } = require("../utils/verifyOwnership");

// Display upload form
exports.getUploadForm = async (req, res) => {
  try {
    // Fetch all projects created by the current user
    const Project = require("../models/project");
    const projects = await Project.find({ createdBy: req.user._id }).sort({
      updatedAt: -1,
    });

    res.render("assets/upload", { projects });
  } catch (error) {
    console.error("Error loading upload form:", error);
    res.render("assets/upload");
  }
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
      projects: [],
      colors: colors,
      tags: req.body.tags
        ? req.body.tags.split(",").map((tag) => tag.trim())
        : [],
    });

    // If a project was selected
    if (req.body.projectId) {
      const project = await Project.findById(req.body.projectId);

      if (project && project.createdBy.toString() === req.user._id.toString()) {
        asset.project = project._id;

        await asset.save();

        project.assets.push(asset._id);
        await project.save();

        console.log(`Asset added to project ${project.name}`);

        // Redirect to the project
        req.flash(
          "success",
          "Asset uploaded and added to project successfully"
        );
        return res.redirect(`/projects/${project._id}`);
      }
    }

    // No project selected 
    await asset.save();

    console.log("Asset uploaded successfully");
    res.redirect("/assets");
  } catch (error) {
    console.error("Error uploading asset:", error);
    res.status(500).render("assets/upload", {
      error: error.message,
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

// Get asset details
exports.getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("project", "name") // Directly populate the project
      .exec();

    if (!asset) {
      req.flash("error", "Asset not found");
      return res.redirect("/assets");
    }

    res.render("assets/show", { asset });
  } catch (error) {
    console.error("Error getting asset details:", error);
    req.flash("error", "Error retrieving asset");
    res.redirect("/assets");
  }
};

// Get edit form
exports.getEditForm = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!verifyOwnership(asset, req.user, req, res, "edit")) {
      return;
    }

    res.render("assets/edit", { asset });
  } catch (error) {
    console.error("Error getting edit form:", error);
    req.flash("error", "Error retrieving asset");
    res.redirect("/assets");
  }
};

// Update asset
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    // Process tags from comma-separated string
    let tags = [];
    if (req.body.tags) {
      tags = req.body.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    // Update asset fields
    asset.fileName = req.body.fileName || asset.fileName;
    asset.tags = tags;
    // TODO: add projects here

    await asset.save();

    req.flash("success", "Asset updated successfully");
    res.redirect(`/assets/${asset._id}`);
  } catch (error) {
    console.error("Error updating asset:", error);
    req.flash("error", "Error updating asset");
    res.redirect(`/assets/edit/${req.params.id}`);
  }
};

// Delete an asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!verifyOwnership(asset, req.user, req, res, "delete")) {
      return;
    }

    // Delete image from Cloudinary
    if (asset.publicId) {
      const cloudinary = require("cloudinary").v2;
      await cloudinary.uploader.destroy(asset.publicId);
    }

    // Delete the asset from the database
    await Asset.findByIdAndDelete(req.params.id);

    // Flash message and redirect
    req.flash("success", "Asset deleted successfully");
    res.redirect("/assets");
  } catch (error) {
    console.error("Error deleting asset:", error);
    req.flash("error", "Error deleting asset");
    res.redirect("/assets");
  }
};
