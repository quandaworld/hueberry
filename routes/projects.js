const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post('/:projectId/assets/:assetId', projectController.addAssetToProject);
router.delete('/:projectId/assets/:assetId', projectController.removeAssetFromProject);