const Project = require('../models/project');
const { verifyOwnership } = require('../utils/verifyOwnership');

// Display new project form
exports.getNewProjectForm = (req, res) => {
  res.render('projects/new');
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    // Get form data
    const { name, description } = req.body;
    
    // Create new project
    const project = new Project({
      name,
      description,
      createdBy: req.user._id,
      assets: []
    });
    
    await project.save();
    
    req.flash('success', 'Project created successfully');
    res.redirect(`/projects/${project._id}`);
  } catch (error) {
    console.error('Error creating project:', error);
    res.render('projects/new', {
      error: 'Error creating project',
      formData: req.body
    });
  }
};

// Get all projects for current user
exports.getUserProjects = async (req, res) => {
  try {
    // Find projects where user is the creator
    const projects = await Project.find({ createdBy: req.user._id })
      .populate({
        path: 'assets',
        select: 'fileUrl', // Only populate the fileUrl for thumbnails
        options: { limit: 3 }
      })
      .sort({ updatedAt: -1 });
    
    res.render('projects/index', { projects });
  } catch (error) {
    console.error('Error getting projects:', error);
    req.flash('error', 'Error retrieving projects');
    res.redirect('/dashboard');
  }
};

// Get project details
exports.getProjectDetails = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate({
        path: 'assets',
        options: { sort: { updatedAt: -1 } }
      });
    
    res.render('projects/show', {
      project,
      user: req.user
    });
  } catch (error) {
    console.error('Error getting project details:', error);
    req.flash('error', 'Error retrieving project');
    res.redirect('/projects');
  }
};

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

// Get edit project form
exports.getEditProjectForm = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/projects');
    }
    
    if (!verifyOwnership(project, req.user, req, res, 'update')) {
      return;
    }
    
    res.render('projects/edit', { project });
  } catch (error) {
    console.error('Error getting edit project form:', error);
    req.flash('error', 'Error retrieving project');
    res.redirect('/projects');
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const projectId = req.params.id;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/projects');
    }
    
    if (!verifyOwnership(project, req.user, req, res, 'update')) {
      return;
    }
    
    // Update project
    project.name = name;
    project.description = description;
    
    await project.save();
    
    req.flash('success', 'Project updated successfully');
    res.redirect(`/projects/${projectId}`);
  } catch (error) {
    console.error('Error updating project:', error);
    req.flash('error', 'Error updating project');
    res.redirect(`/projects/edit/${req.params.id}`);
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

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/projects');
    }
    
    if (!verifyOwnership(project, req.user, req, res, 'delete')) {
      return;
    }
    
    // Delete project
    await Project.findByIdAndDelete(projectId);
    
    req.flash('success', 'Project deleted successfully');
    res.redirect('/projects');
  } catch (error) {
    console.error('Error deleting project:', error);
    req.flash('error', 'Error deleting project');
    res.redirect('/projects');
  }
};
