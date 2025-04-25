const Category = require("../models/categoryModel");
const categoryValidator = require("../middlewares/categoryValidator");

exports.createCat = async (req, res) => {
  try {
    const { error } = categoryValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const newCategory = new Category(req.body);
    await newCategory.save();

    res.status(201).send({
      success: true,
      message: "Category created successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In Create category api",
    });
  }
};

exports.getAllCat = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res.status(404).send({
        success: false,
        message: "No categories available!",
      });
    }

    res.status(200).send({
      success: true,
      categories,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get all categories api",
    });
  }
};

exports.getCat = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found!",
      });
    }

    res.status(200).send({
      success: true,
      category,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In get category api",
    });
  }
};

exports.updateCat = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const { error } = categoryValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In update category api",
    });
  }
};

exports.deleteCat = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: "Please provide an ID!",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error In delete category api",
    });
  }
};
