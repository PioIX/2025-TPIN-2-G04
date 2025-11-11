// routes/gameRoutes.js
const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

// 🔹 Crear partida
router.post("/create", async (req, res) => {
  try {
    const { player1_id } = req.body;
    await Game.create(player1_id);
    res.status(201).json({ message: "Partida creada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al crear partida" });
  }
});

// 🔹 Unirse a una partida
router.post("/join", async (req, res) => {
  try {
    const { game_id, player2_id } = req.body;
    await Game.join(game_id, player2_id);
    res.json({ message: "Jugador unido a la partida" });
  } catch (err) {
    res.status(500).json({ message: "Error al unirse a la partida" });
  }
});

// 🔹 Finalizar partida
router.post("/finish", async (req, res) => {
  try {
    const { game_id, winner_id } = req.body;
    await Game.finish(game_id, winner_id);
    res.json({ message: "Partida finalizada" });
  } catch (err) {
    res.status(500).json({ message: "Error al finalizar la partida" });
  }
});

// 🔹 Listar partidas disponibles
router.get("/available", async (req, res) => {
  try {
    const games = await Game.getAvailable();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener partidas" });
  }
});

module.exports = router;
