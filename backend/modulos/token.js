// backend/modulos/token.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generarToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

exports.verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
