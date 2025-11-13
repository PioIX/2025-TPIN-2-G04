// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar campos
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar longitud de password
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Hash del password
    const password_hash = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await User.create(username, email, password_hash);

    res.status(201).json({ 
      message: "Usuario registrado correctamente",
      userId: result.insertId
    });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// 🔹 Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token
    const token = generateToken(user);

    // No enviar el hash de la contraseña al cliente
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    };

    res.json({ 
      message: "Login exitoso",
      token,
      user: userResponse
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el login" });
  }
});

// 🔹 Obtener perfil del usuario autenticado
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // No enviar el hash de la contraseña
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    };

    res.json(userResponse);
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// 🔹 Obtener todos los usuarios (protegido)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// 🔹 Actualizar usuario (protegido)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    // Verificar que el usuario solo pueda actualizar su propia información
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este usuario" });
    }

    if (!username || !email) {
      return res.status(400).json({ message: "Username y email son obligatorios" });
    }

    await User.update(id, username, email);
    
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

// 🔹 Eliminar usuario (protegido)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo pueda eliminar su propia cuenta
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este usuario" });
    }

    await User.delete(id);
    
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

module.exports = router;