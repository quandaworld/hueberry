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
    colors: [
      {
        rgb: [Number],
        percentage: Number,
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
