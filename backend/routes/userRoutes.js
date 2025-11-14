// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registrar,
  login,
  verificarCodigo,
  me
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/register", registrar);
router.post("/login", login);
router.post("/verify-code", verificarCodigo);
router.get("/me", verifyToken, me);

module.exports = router;

