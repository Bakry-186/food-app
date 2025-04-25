const jwt = require("jsonwebtoken");

const identifier = (req, res, next) => {
  let token;
  if (req.headers.client == "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies["Authorization"];
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const userToken = token.split(" ")[1];
    const jwtVerified = jwt.verify(userToken, process.env.SECRET_ACCESS_TOKEN);

    if (jwtVerified) {
      req.user = jwtVerified;
      next();
    } else {
      throw new Error("Error in the token");
    }
  } catch (e) {
    console.log(e);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = identifier;
