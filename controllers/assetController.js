const Asset = require('../models/asset');
const { extractColors } = require('../utils/colorAnalysis');

// Display upload form
exports.getUploadForm = (req, res) => {
  res.render('assets/upload');
};

// Handle image upload
exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).render('assets/upload', { 
        error: 'Please select an image to upload' 
      });
    }

    // Extract colors from the uploaded image
    const colors = await extractColors(req.file.path);

    // Create new asset
    const asset = new Asset({
      title: req.body.title,
      description: req.body.description,
      fileUrl: req.file.path,
      publicId: req.file.filename, // Cloudinary public ID
      fileType: req.file.mimetype,
      createdBy: req.user._id,
      colors: colors,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    });

    await asset.save();
    req.flash('success', 'Asset uploaded successfully');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error uploading asset:', error);
    res.status(500).render('assets/upload', { 
      error: 'Error uploading asset' 
    });
  }
};

// Get all assets for current user
exports.getUserAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.render('assets/index', { assets });
  } catch (error) {
    console.error('Error getting assets:', error);
    req.flash('error', 'Error retrieving your assets');
    res.redirect('/dashboard');
  }
};

// Get single asset details
exports.getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }
    
    // Check if user owns the asset
    if (asset.createdBy.toString() !== req.user._id.toString()) {
      req.flash('error', 'Not authorized');
      return res.redirect('/assets');
    }
    
    res.render('assets/show', { asset });
  } catch (error) {
    console.error('Error getting asset details:', error);
    req.flash('error', 'Error retrieving asset details');
    res.redirect('/assets');
  }
};