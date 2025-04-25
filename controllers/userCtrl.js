const userValidator = require("../middlewares/userValidator.js");
const User = require("../models/usersModel.js");
const { doHash, doHashValidation } = require("../utils/hashing.js");

exports.getProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const exitstingUser = await User.findById(userId).select("-password");

    if (!exitstingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    res.status(200).send({ success: true, user: exitstingUser });
  } catch (e) {
    console.log(e);
  }
};

exports.updateProfile = async (req, res) => {
  const { userId } = req.user;
  const { name, phone, address } = req.body;

  try {
    const { error } = userValidator.profileUpdateValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    if (name) existingUser.name = name;
    if (phone) existingUser.phone = phone;
    if (address) existingUser.address = address;

    await existingUser.save();

    res.status(200).send({ success: true, message: "Updated successfully" });
  } catch (e) {
    console.log(e);
  }
};

exports.changePassword = async (req, res) => {
  const { userId, verified } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error } = userValidator.passwordChangeValidator.validate({
      oldPassword,
      newPassword,
    });

    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    if (!verified) {
      return res
        .status(403)
        .send({ success: false, message: "User not verified!" });
    }

    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    const result = await doHashValidation(oldPassword, existingUser.password);

    if (!result) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials!" });
    }

    const hashedPassword = await doHash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    res
      .status(200)
      .send({ success: true, message: "Password changed successfully" });
  } catch (e) {
    console.log(e);
  }
};

exports.deleteProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const existingUser = await User.findByIdAndDelete(userId);

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    res
      .status(200)
      .send({ success: true, message: "User deleted successfully!" });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllUsers = async (req, res) => {
  const { page } = req.query;
  const usersPerPage = 10;

  try {
    let pageNum = 0;
    if (page <= 1) {
      pageNum = 0;
    } else {
      pageNum -= page;
    }

    const result = await User.find()
      .sort({ createdAt: -1 })
      .skip(pageNum * usersPerPage)
      .limit(usersPerPage);

    res.status(200).send({ success: true, users: result });
  } catch (e) {
    console.log(e);
  }
};

exports.getSpecificUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    res.status(200).send({ success: true, user: existingUser });
  } catch (e) {
    console.log(e);
  }
};

exports.updateSpecificUser = async (req, res) => {
  const { name, phone, address, role, password } = req.body;
  try {
    const { error } = userValidator.userUpdateValidator.validate(req.body);

    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    if (name) existingUser.name = name;
    if (password) existingUser.password = password;
    if (phone) existingUser.phone = phone;
    if (address) existingUser.address = address;
    if (role) existingUser.role = role;

    await existingUser.save();

    res.status(200).send({ success: true, user: existingUser });
  } catch (e) {
    console.log(e);
  }
};

exports.deleteSpecificUser = async (req, res) => {
  try {
    const existingUser = await User.findByIdAndDelete(req.params.id);

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    res
      .status(200)
      .send({ success: true, message: "User deleted successfully!" });
  } catch (e) {
    console.log(e);
  }
};
