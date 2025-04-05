const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    colors: [
      {
        rgb: [Number],
        hex: String,
        percentage: Number,
      },
    ],
    tags: [String],
    notes: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
