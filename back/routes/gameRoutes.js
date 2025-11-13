// routes/gameRoutes.js
const express = require("express");
const router = express.Router();
const Game = require("../models/game.js");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Crear partida (protegido)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const player1_id = req.user.id; // Obtener ID del token JWT
    
    const result = await Game.create(player1_id);
    
    res.status(201).json({ 
      message: "Partida creada correctamente",
      game: {
        id: result.insertId,
        player1_id,
        status: 'waiting'
      }
    });
  } catch (err) {
    console.error("Error al crear partida:", err);
    res.status(500).json({ message: "Error al crear partida" });
  }
});

// 🔹 Unirse a una partida (protegido)
router.post("/join/:gameId", authMiddleware, async (req, res) => {
  try {
    const { gameId } = req.params;
    const player2_id = req.user.id;

    // Verificar que la partida existe
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({ message: "La partida ya no está disponible" });
    }

    if (game.player1_id === player2_id) {
      return res.status(400).json({ message: "No puedes unirte a tu propia partida" });
    }

    await Game.join(gameId, player2_id);
    
    res.json({ 
      message: "Jugador unido a la partida",
      game: {
        id: gameId,
        player1_id: game.player1_id,
        player2_id,
        status: 'ongoing'
      }
    });
  } catch (err) {
    console.error("Error al unirse a partida:", err);
    res.status(500).json({ message: "Error al unirse a la partida" });
  }
});

// 🔹 Finalizar partida (protegido)
router.post("/finish", authMiddleware, async (req, res) => {
  try {
    const { game_id, winner_id } = req.body;

    if (!game_id || !winner_id) {
      return res.status(400).json({ message: "game_id y winner_id son obligatorios" });
    }

    // Verificar que la partida existe
    const game = await Game.findById(game_id);
    
    if (!game) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    // Verificar que el usuario es uno de los jugadores
    if (game.player1_id !== req.user.id && game.player2_id !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para finalizar esta partida" });
    }

    await Game.finish(game_id, winner_id);
    
    res.json({ message: "Partida finalizada" });
  } catch (err) {
    console.error("Error al finalizar partida:", err);
    res.status(500).json({ message: "Error al finalizar la partida" });
  }
});

// 🔹 Listar partidas disponibles
router.get("/available", async (req, res) => {
  try {
    const games = await Game.getAvailable();
    res.json(games);
  } catch (err) {
    console.error("Error al obtener partidas:", err);
    res.status(500).json({ message: "Error al obtener partidas" });
  }
});

// 🔹 Obtener una partida por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    
    if (!game) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }
    
    res.json(game);
  } catch (err) {
    console.error("Error al obtener partida:", err);
    res.status(500).json({ message: "Error al obtener partida" });
  }
});

// 🔹 Obtener todas las partidas
router.get("/", async (req, res) => {
  try {
    const games = await Game.getAll();
    res.json(games);
  } catch (err) {
    console.error("Error al obtener partidas:", err);
    res.status(500).json({ message: "Error al obtener partidas" });
  }
});

// 🔹 Obtener partidas del usuario autenticado (protegido)
router.get("/user/me", authMiddleware, async (req, res) => {
  try {
    const games = await Game.getByUser(req.user.id);
    res.json(games);
  } catch (err) {
    console.error("Error al obtener partidas del usuario:", err);
    res.status(500).json({ message: "Error al obtener partidas del usuario" });
  }
});

module.exports = router;