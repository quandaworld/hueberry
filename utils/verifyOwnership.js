exports.verifyOwnership = (resource, user, req, res, action) => {
  if (resource.createdBy.toString() !== user._id.toString()) {
    req.flash("error", `You do not have permission to ${action} this visual`);
    res.redirect("/assets");
    return false;
  }

  return true;
};
