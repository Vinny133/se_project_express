const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next({
      statusCode: UNAUTHORIZED_ERROR,
      message: "Missing or malformed token",
    });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next({
      statusCode: UNAUTHORIZED_ERROR,
      message: "Invalid token",
    });
  }

  req.user = payload;

  return next();
};
