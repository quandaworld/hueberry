exports.verifyOwnership = (asset, user, req, res, action) => {
  if (asset.createdBy.toString() !== user._id.toString()) {
    req.flash("error", `You do not have permission to ${action} this visual`);
    res.redirect("/assets");
    return false;
  }

  return true;
};
