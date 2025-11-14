// backend/controllers/gameController.js
const { realizarQuery } = require("../modulos/mysql");

// CREAR PARTIDA
exports.crearPartida = async (req, res) => {
  const { userId } = req.body;
  
  try {
    const resultado = await realizarQuery(
      "INSERT INTO partidas (player1_id, estado) VALUES (?, 'esperando')",
      [userId]
    );

    const partidaId = resultado.insertId;
    res.json({
      mensaje: "Partida creada",
      partidaId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al crear la partida" });
  }
};

// UNIRSE A UNA PARTIDA
exports.unirsePartida = async (req, res) => {
  const { partidaId, userId } = req.body;
  
  try {
    const partida = await realizarQuery(
      "SELECT * FROM partidas WHERE id = ?",
      [partidaId]
    );

    if (partida.length === 0) {
      return res.status(400).json({ mensaje: "La partida no existe" });
    }

    if (partida[0].player2_id !== null) {
      return res.status(400).json({ mensaje: "La partida ya está llena" });
    }

    await realizarQuery(
      "UPDATE partidas SET player2_id = ?, estado = 'jugando' WHERE id = ?",
      [userId, partidaId]
    );

    res.json({ mensaje: "Te uniste a la partida" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al unirse a la partida" });
  }
};

// LISTAR PARTIDAS
exports.listarPartidas = async (req, res) => {
  try {
    const partidas = await realizarQuery(
      "SELECT id, player1_id, player2_id, estado FROM partidas"
    );
    res.json(partidas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al listar las partidas" });
  }
};

// OBTENER PARTIDA
exports.obtenerPartida = async (req, res) => {
  const { id } = req.params;
  
  try {
    const partida = await realizarQuery(
      "SELECT * FROM partidas WHERE id = ?",
      [id]
    );

    if (partida.length === 0) {
      return res.status(404).json({ mensaje: "La partida no existe" });
    }

    res.json(partida[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener la partida" });
  }
};