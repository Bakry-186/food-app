const express = require("express");
authCtrl = require("../controllers/authCtrl.js");
const identifier = require("../middlewares/identification.js");

const router = express.Router();

router.post("/signup", authCtrl.signup);
router.post("/signin", authCtrl.signin);
router.post("/signout", identifier, authCtrl.signout);

router.patch("/send-verification-code", identifier, authCtrl.sendVerificationCode);
router.patch("/verify-verification-code", identifier, authCtrl.verifyVerificationCode);

router.patch("/send-forgot-password-code", authCtrl.sendPasswordCode);
router.patch("/verify-forgot-password-code", authCtrl.verifyPasswordCode);

router.post("/refresh-token", authCtrl.refreshAccessToken);

module.exports = router;
