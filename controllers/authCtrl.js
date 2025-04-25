const transport = require("../utils/sendmail.js");
const authValidator = require("../middlewares/authValidator.js");
const User = require("../models/usersModel.js");
const {
  doHash,
  doHashValidation,
  hmacProcess,
} = require("../utils/hashing.js");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;
  try {
    const { error } = authValidator.signupSchema.validate({
      name,
      email,
      password,
      role,
      phone,
      address,
    });
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "User already exist." });
    }
    const hashedPassword = await doHash(password, 8);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).send({
      success: true,
      message: "Your account has been created successfully",
      result,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error } = authValidator.signinSchema.validate({ email, password });
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email }).select(
      "+password +refreshTokens"
    );
    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        verified: existingUser.verified,
      },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: existingUser._id },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: "30d" }
    );

    existingUser.refreshTokens.push(refreshToken);
    await existingUser.save();

    res
      .cookie("Authorization", `Bearer ${token}`, {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .send({
        success: true,
        token,
        message: "Logged in successfully",
      });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};

exports.signout = async (req, res) => {
  const refreshToken = req.cookies["RefreshToken"];
  await User.findOneAndUpdate(
    { _id: req.user.userId },
    { $pull: { refreshTokens: refreshToken } },
    { new: true }
  );
  res
    .clearCookie("RefreshToken")
    .clearCookie("Authorization")
    .status(200)
    .send({
      success: true,
      message: "Logged out successfully",
    });
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    if (existingUser.verified) {
      return res
        .status(400)
        .send({ success: false, message: "User already verified!" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Verification Code",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodeValidation = Date.now() + 5 * 60 * 1000;
      await existingUser.save();

      return res.status(200).send({
        success: true,
        message: "Code sent!",
      });
    }

    res.status(500).send({
      success: false,
      message: "Code sent failed!",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};

exports.verifyVerificationCode = async (req, res) => {
  const { email, providedCode } = req.body;
  try {
    const { error } = authValidator.acceptedCodeSchema.validate({
      email,
      providedCode,
    });
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    if (existingUser.verified == true) {
      return res
        .status(400)
        .send({ success: false, message: "User already verified!" });
    }

    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res
        .status(400)
        .send({ success: false, message: "Something is wrong!" });
    }

    if (Date.now() > existingUser.verificationCodeValidation) {
      return res.status(400).send({ success: false, message: "Code expired!" });
    }

    const codeValue = providedCode.toString();
    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    if (existingUser.verificationCode === hashedCodeValue) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();

      return res.status(200).send({
        success: true,
        message: "Your account has been verified!",
      });
    }

    res.status(400).send({
      success: false,
      message: "Unexpected occured!",
    });
  } catch (e) {
    console.log(e);
  }
};

exports.sendPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Forgot Password Code",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.forgotPasswordCode = hashedCodeValue;
      existingUser.forgotPasswordCodeValidation = Date.now() + 5 * 60 * 1000;
      await existingUser.save();

      return res.status(200).send({
        success: true,
        message: "Code sent!",
      });
    }

    res.status(500).send({
      success: false,
      message: "Code sent failed!",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};

exports.verifyPasswordCode = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error } = authValidator.acceptedFPCodeSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation"
    );

    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return res
        .status(400)
        .send({ success: false, message: "Something is wrong!" });
    }

    if (Date.now() > existingUser.forgotPasswordCodeValidation) {
      return res.status(400).send({ success: false, message: "Code expired!" });
    }

    const codeValue = providedCode.toString();
    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    if (existingUser.forgotPasswordCode === hashedCodeValue) {
      const hashedPassword = await doHash(newPassword, 10);
      existingUser.password = hashedPassword;
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();

      return res.status(200).send({
        success: true,
        message: "Password updated!",
      });
    }

    res.status(400).send({
      success: false,
      message: "Unexpected occured!",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["RefreshToken"];
    if (!refreshToken) {
      return res
        .status(403)
        .send({ success: false, message: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
    const user = await User.findById(decoded.userId).select("+refreshTokens");

    if (!user) {
      return res
        .status(403)
        .send({ success: false, message: "User not found" });
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      return res
        .status(403)
        .send({ success: false, message: "Invalid refresh token" });
    }

    user.refreshTokens = user.refreshTokens.filter((rt) => rt !== refreshToken);

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: "30d" }
    );

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    res
      .cookie("Authorization", `Bearer ${newAccessToken}`, {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .cookie("RefreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .send({
        success: true,
        token: newAccessToken,
      });
  } catch (e) {
    console.log(e);
    return res
      .status(403)
      .send({ success: false, message: "Could not refresh token" });
  }
};
