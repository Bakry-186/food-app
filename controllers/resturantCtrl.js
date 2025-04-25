const Resturant = require("../models/resturantModel");
const resturantValidator = require("../middlewares/resturantValidator");

exports.createResturant = async (req, res) => {
  try {
    const { error } = resturantValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const newResturant = new Resturant(req.body);
    await newResturant.save();

    res.status(201).send({
      success: true,
      message: "Resturant created successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In Create Resturant api",
    });
  }
};

exports.getAllResturants = async (req, res) => {
  try {
    const resturants = await Resturant.find();

    if (!resturants) {
      return res.status(404).send({
        success: false,
        message: "No resturants available!",
      });
    }

    res.status(200).send({
      success: true,
      resturants,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get all resturants api",
    });
  }
};

exports.getResturant = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const resturant = await Resturant.findById(req.params.id);

    if (!resturant) {
      return res.status(404).send({
        success: false,
        message: "Resturant not found!",
      });
    }

    res.status(200).send({
      success: true,
      resturant,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get resturant api",
    });
  }
};

exports.deleteResturant = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const resturant = await Resturant.findByIdAndDelete(req.params.id);

    if (!resturant) {
      return res.status(404).send({
        success: false,
        message: "Resturant not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Resturant deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In delete resturant api",
    });
  }
};
