const express = require("express");
const categoryCtrl = require("../controllers/categoryCtrl.js");
const identifier = require("../middlewares/identification.js");
const authorizeRoles = require("../middlewares/role.js");

const router = express.Router();

router.post(
  "/create",
  identifier,
  authorizeRoles("admin"),
  categoryCtrl.createCat
);

router.get("/get-all", identifier, categoryCtrl.getAllCat);
router.get("/get/:id", identifier, categoryCtrl.getCat);

router.patch(
  "/update/:id",
  identifier,
  authorizeRoles("admin"),
  categoryCtrl.updateCat
);

router.delete(
  "/delete/:id",
  identifier,
  authorizeRoles("admin"),
  categoryCtrl.deleteCat
);

module.exports = router;
