const express = require("express");
const orderCtrl = require("../controllers/orderCtrl.js");
const identifier = require("../middlewares/identification.js");
const authorizeRoles = require("../middlewares/role.js");

const router = express.Router();

router.post("/place-order", identifier, orderCtrl.placeOrder);
router.post(
  "/update-order-status/:id",
  identifier,
  authorizeRoles("admin"),
  orderCtrl.updateOrderStatus
);

router.get("/get-orders", identifier, orderCtrl.getOrdersHistory);

router.delete("/cancel/:id", identifier, orderCtrl.cancelOrder);

module.exports = router;
