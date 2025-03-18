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

// Edit routes
router.get('/edit/:id', assetController.getEditForm);
router.post('/edit/:id', assetController.updateAsset);

// Asset delete route
router.post("/:id", assetController.deleteAsset);

module.exports = router;
