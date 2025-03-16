const { upload } = require("../config/cloudinary");

exports.uploadImage = upload.single("image");
exports.uploadMultipleImages = upload.array("images", 5);
