const express = require("express");
const identifier = require("../middlewares/identification.js");
const authorizeRoles = require("../middlewares/role.js");
const userCtrl = require("../controllers/userCtrl.js");

const router = express.Router();

router.get("/profile", identifier, authorizeRoles("admin", "client", "vendor", "deliver"), userCtrl.getProfile);
router.patch(
  "/profile",
  identifier,
  authorizeRoles("admin", "client", "vendor", "deliver"),
  userCtrl.updateProfile
);

router.patch("/change-password", identifier, authorizeRoles("admin", "client", "vendor", "deliver"), userCtrl.changePassword);

router.delete("/profile", identifier, authorizeRoles("admin", "client", "vendor", "deliver"), userCtrl.deleteProfile)

// Admin

router.get("/all-users", identifier, authorizeRoles("admin"), userCtrl.getAllUsers)
router.get("/profile/:id", identifier, authorizeRoles("admin"), userCtrl.getSpecificUser)

router.patch("/profile/:id", identifier, authorizeRoles("admin"), userCtrl.updateSpecificUser)

router.delete("/profile/:id", identifier, authorizeRoles("admin"), userCtrl.deleteSpecificUser)

module.exports = router;
