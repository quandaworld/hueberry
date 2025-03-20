const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const ensureAuthenticated = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");

// Ensure user is authenticated for all routes
router.use(ensureAuthenticated); 

// Upload form routes
router.get("/upload", assetController.getUploadForm);
router.post("/upload", uploadImage, assetController.uploadAsset);

// Asset listing route
router.get("/", assetController.getUserAssets);

// Asset detail route
router.get("/:id", assetController.getAssetDetails);

// Get edit form
router.get('/edit/:id', assetController.getEditForm);

// Update asset
router.put('/edit/:id', assetController.updateAsset);

// Asset delete route
router.delete("/:id", assetController.deleteAsset);

module.exports = router;
