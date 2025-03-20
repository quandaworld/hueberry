const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const ensureAuthenticated = require("../middleware/auth");

// Ensure user is authenticated for all routes
router.use(ensureAuthenticated);

// New project form
router.get('/new', projectController.getNewProjectForm);

// Create project
router.post('/', projectController.createProject);

// User projects
router.get('/', projectController.getUserProjects);

// Edit project form
router.get('/edit/:id', projectController.getEditProjectForm);

// Update project
router.put('/edit/:id', projectController.updateProject);

// Project details
router.get('/:id', projectController.getProjectDetails);

// Add asset to project
router.post('/:projectId/assets/:assetId', projectController.addAssetToProject);

// Remove asset from project
router.delete('/:projectId/assets/:assetId', projectController.removeAssetFromProject);

// Delete project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
