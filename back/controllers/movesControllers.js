const { realizarQuery } = require("../modulos/mysql");

// 📌 Guardar movimiento
exports.saveMove = async (req, res) => {
  const { game_id, player_id, move_notation } = req.body;

  try {
    await realizarQuery(`
      INSERT INTO moves (game_id, player_id, move_notation, move_time)
      VALUES (${game_id}, ${player_id}, '${move_notation}', NOW())
    `);
    res.status(201).json({ message: "Movimiento guardado" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al guardar movimiento" });
  }
};

// 📌 Obtener movimientos de una partida
exports.getMovesByGame = async (req, res) => {
  const { game_id } = req.params;

  try {
    const moves = await realizarQuery(`SELECT * FROM moves WHERE game_id=${game_id}`);
    res.json(moves);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al obtener movimientos" });
  }
};
