const orderValidator = require("../middlewares/orderValidator");
const Food = require("../models/foodModel");
const Order = require("../models/orderModel");

exports.placeOrder = async (req, res) => {
  try {
    const { cart } = req.body;

    const { error } = orderValidator.orderPlaceValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    if (!cart || !Array.isArray(cart || cart.length == 0)) {
      return res.status(400).send({
        success: false,
        message: "No food items provided!",
      });
    }

    const foods = await Food.find({ _id: { $in: cart } });

    if (foods.length !== cart.length) {
      return res.status(400).send({
        success: false,
        message: "Some foods not found!",
      });
    }

    const totalPrice = foods.reduce((total, food) => total + food.price, 0);

    const order = new Order({
      cart,
      buyer: req.user.userId,
    });

    await order.save();

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
      price: totalPrice,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In Place Order API",
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const { status } = req.body;

    const { error } = orderValidator.orderUpdateValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order status updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In update order status API",
    });
  }
};

exports.getOrdersHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ buyer: userId });

    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "No users found!",
      });
    }

    res.status(200).send({
      success: true,
      orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get orders history API",
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found!",
      });
    }

    const now = new Date();
    const createdAt = new Date(order.createdAt);

    if (now - createdAt > 60 * 1000) {
      return res.status(400).send({
        success: false,
        message: "You can only cancel the order within 1 minute of placing it.",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success: true,
      message: "Order canceled successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In cancel order API",
    });
  }
};
