const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(403).json({
      msg: "Token diperlukan",
    });
  }

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  const secret = process.env.JWT_SECRET;
  try {
    const jwtDecode = jwt.verify(token, secret);
    req.user = jwtDecode;
  } catch (err) {
    return res.status(403).json({
      msg: "Token tidak sah",
    });
  }
  next();
};

module.exports = { verifyToken };
