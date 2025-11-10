// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar campos
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // Hash del password
    const password_hash = await bcrypt.hash(password, 10);

    await User.create(username, email, password_hash);
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// 🔹 Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el login" });
  }
});

// 🔹 Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

module.exports = router;
