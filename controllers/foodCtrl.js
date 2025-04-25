const Food = require("../models/foodModel");
const foodValidator = require("../middlewares/foodValidator");

exports.createFood = async (req, res) => {
  try {
    const { error } = foodValidator.creationValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const newfood = new Food(req.body);
    await newfood.save();

    res.status(201).send({
      success: true,
      message: "Food created successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In Create food api",
    });
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();

    if (!foods) {
      return res.status(404).send({
        success: false,
        message: "No foods available!",
      });
    }

    res.status(200).send({
      success: true,
      foods,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get all foods api",
    });
  }
};

exports.getFood = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found!",
      });
    }

    res.status(200).send({
      success: true,
      food,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get food api",
    });
  }
};

exports.getFoodByResturant = async (req, res) => {
  try {
    const resturantId = req.params.id;

    if (!resturantId) {
      return res.status(404).send({
        success: false,
        message: "Please provide a resturant ID!",
      });
    }

    const foods = await Food.find({ resturant: resturantId });

    if (!foods) {
      return res.status(404).send({
        success: false,
        message: "No food found for this resturant!",
      });
    }

    res.status(200).send({
      success: true,
      foods,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get food by resturant api",
    });
  }
};

exports.updateFood = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const { error } = foodValidator.UpdateValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Food updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In update food api",
    });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).send({
        success: false,
        message: "food not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "food deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In delete food api",
    });
  }
};
