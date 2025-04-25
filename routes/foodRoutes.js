const express = require("express");
const foodCtrl = require("../controllers/foodCtrl.js");
const identifier = require("../middlewares/identification.js");
const authorizeRoles = require("../middlewares/role.js");

const router = express.Router();

router.post(
  "/create",
  identifier,
  authorizeRoles("admin"),
  foodCtrl.createFood
);

router.get("/get-all", identifier, foodCtrl.getAllFoods);
router.get("/get/:id", identifier, foodCtrl.getFood);
router.get("/get-by-resturant/:id", identifier, foodCtrl.getFoodByResturant);

router.patch(
  "/update/:id",
  identifier,
  authorizeRoles("admin"),
  foodCtrl.updateFood
);

router.delete(
  "/delete/:id",
  identifier,
  authorizeRoles("admin"),
  foodCtrl.deleteFood
);

module.exports = router;
