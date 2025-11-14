// backend/middlewares/verifyToken.js
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // datos del usuario dentro del token
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};
