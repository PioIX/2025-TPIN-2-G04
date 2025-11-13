// routes/moveRoutes.js
const express = require("express");
const router = express.Router();
const Move = require("../models/Move.js");
const Game = require("../models/game.js");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Registrar movimiento (protegido)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { game_id, move_notation, move_number } = req.body;
    const player_id = req.user.id;

    if (!game_id || !move_notation || !move_number) {
      return res.status(400).json({ 
        message: "game_id, move_notation y move_number son obligatorios" 
      });
    }

    // Verificar que la partida existe
    const game = await Game.findById(game_id);
    
    if (!game) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    // Verificar que el usuario es uno de los jugadores
    if (game.player1_id !== player_id && game.player2_id !== player_id) {
      return res.status(403).json({ 
        message: "No tienes permiso para hacer movimientos en esta partida" 
      });
    }

    // Verificar que la partida está en curso
    if (game.status !== 'ongoing') {
      return res.status(400).json({ 
        message: "La partida no está en curso" 
      });
    }

    const result = await Move.create(game_id, player_id, move_notation, move_number);
    
    res.status(201).json({ 
      message: "Movimiento registrado",
      moveId: result.insertId
    });
  } catch (err) {
    console.error("Error al registrar movimiento:", err);
    res.status(500).json({ message: "Error al registrar movimiento" });
  }
});

// 🔹 Obtener movimientos por partida
router.get("/:game_id", async (req, res) => {
  try {
    const { game_id } = req.params;
    
    // Verificar que la partida existe
    const game = await Game.findById(game_id);
    
    if (!game) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    const moves = await Move.getByGame(game_id);
    res.json(moves);
  } catch (err) {
    console.error("Error al obtener movimientos:", err);
    res.status(500).json({ message: "Error al obtener movimientos" });
  }
});

// 🔹 Obtener último movimiento de una partida
router.get("/:game_id/last", async (req, res) => {
  try {
    const { game_id } = req.params;
    
    const lastMove = await Move.getLastMove(game_id);
    
    if (!lastMove) {
      return res.status(404).json({ message: "No hay movimientos en esta partida" });
    }

    res.json(lastMove);
  } catch (err) {
    console.error("Error al obtener último movimiento:", err);
    res.status(500).json({ message: "Error al obtener último movimiento" });
  }
});

module.exports = router;