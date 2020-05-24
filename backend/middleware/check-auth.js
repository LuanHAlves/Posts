const jwt = require("jsonwebtoken");

const secretKey = "secret_this_should_be_longer";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Auth failed",
    });
  }
};
