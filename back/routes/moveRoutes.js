// routes/moveRoutes.js
const express = require("express");
const router = express.Router();
const Move = require("../models/Move");

// 🔹 Registrar movimiento
router.post("/add", async (req, res) => {
  try {
    const { game_id, player_id, move_notation, move_number } = req.body;
    await Move.create(game_id, player_id, move_notation, move_number);
    res.status(201).json({ message: "Movimiento registrado" });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar movimiento" });
  }
});

// 🔹 Obtener movimientos por partida
router.get("/:game_id", async (req, res) => {
  try {
    const { game_id } = req.params;
    const moves = await Move.getByGame(game_id);
    res.json(moves);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener movimientos" });
  }
});

module.exports = router;
