const Project = require('../models/project');
const { verifyOwnership } = require('../utils/verifyOwnership');

// Add asset to project
exports.addAssetToProject = async (req, res) => {
  try {
    const { projectId, assetId } = req.params;
    
    const project = await Project.findById(projectId);
    
    if (!verifyOwnership(project, req.user, req, res, 'update')) {
      return;
    }
    
    // Check if asset is already in project
    if (project.assets.includes(assetId)) {
      req.flash('info', 'Asset is already in this project');
      return res.redirect(`/projects/${projectId}`);
    }
    
    // Add asset to project
    project.assets.push(assetId);
    await project.save();
    
    req.flash('success', 'Asset added to project successfully');
    res.redirect(`/projects/${projectId}`);
  } catch (error) {
    console.error('Error adding asset to project:', error);
    req.flash('error', 'Error adding asset to project');
    res.redirect('/projects');
  }
};

// Remove asset from project
exports.removeAssetFromProject = async (req, res) => {
  try {
    const { projectId, assetId } = req.params;
    
    const project = await Project.findById(projectId);
    
    if (!verifyOwnership(project, req.user, req, res, 'update')) {
      return;
    }
    
    // Remove asset from project
    project.assets = project.assets.filter(asset => asset.toString() !== assetId);
    await project.save();
    
    req.flash('success', 'Asset removed from project');
    res.redirect(`/projects/${projectId}`);
  } catch (error) {
    console.error('Error removing asset from project:', error);
    req.flash('error', 'Error removing asset from project');
    res.redirect('/projects');
  }
};