const express = require("express");
const resturantCtrl = require("../controllers/resturantCtrl.js");
const identifier = require("../middlewares/identification.js");
const authorizeRoles = require("../middlewares/role.js");

const router = express.Router();

router.post(
  "/create",
  identifier,
  authorizeRoles("admin"),
  resturantCtrl.createResturant
);

router.get("/get-all", identifier, resturantCtrl.getAllResturants);
router.get("/get/:id", identifier, resturantCtrl.getResturant);

router.delete(
  "/delete/:id",
  identifier,
  authorizeRoles("admin"),
  resturantCtrl.deleteResturant
);

module.exports = router;
